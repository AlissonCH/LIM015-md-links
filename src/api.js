const fs = require("fs");
const path = require("path");
const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
});
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");
require("colors");

const readFile = (pathAbsolute) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathAbsolute, "utf-8", (err, fileData) => {
      if (err) return reject(`${"ERROR: ".red} ${err}`);
      else return resolve(fileData);
    });
  });
};

const toPathAbsolute = (pathFile) => {
  let pathAbsolute;
  if (path.isAbsolute(pathFile)) {
    let { dir, base, ext, name } = path.parse(pathFile);
    ext === "" ? (ext = ".md") : ext;
    base = name + ext;
    pathAbsolute = path.join(dir, base);
  } else {
    let { dir, base, ext, name } = path.parse(pathFile);
    ext === "" ? (ext = ".md") : ext;
    base = name + ext;
    dir !== ""
      ? (pathAbsolute = path.resolve(path.join(dir, base)))
      : (pathAbsolute = path.join(process.cwd(), base));
  }
  return pathAbsolute;
};

const arrayOfLinks = (dataFile, pathAbsolute) => {
  const lines = dataFile.split(/\r?\n/);
  const renderFile = md.render(dataFile); // string to HTML
  const dom = new JSDOM(renderFile); // transform HTML to DOM
  const a = dom.window.document.querySelectorAll("a"); // 'NodeList'
  const img = dom.window.document.querySelectorAll("img"); // 'NodeList'
  const arrayOfLinks = new Array();
  a.forEach((a) => {
    const { href, text } = a;
    let line;
    lines.forEach((ln) => {
      if (ln.toUpperCase().includes(href.toUpperCase())) {
        line = lines.indexOf(ln) + 1;
      }
    });
    const link = {};
    link["href"] = href;
    link["text"] = text;
    link["file"] = pathAbsolute;
    link["line"] = line;
    arrayOfLinks.push(link);
  });
  if (img) {
    img.forEach((img) => {
      const { src, alt } = img;
      let line;
      lines.forEach((ln) => {
        if (ln.toUpperCase().includes(src.toUpperCase())) {
          line = lines.indexOf(ln) + 1;
        }
      });
      const link = {};
      link["href"] = src;
      link["text"] = alt;
      link["file"] = pathAbsolute;
      link["line"] = line;
      arrayOfLinks.push(link);
    });
  }
  return arrayOfLinks;
};
const arrayOfLinksWithStatus = (arrayOfLinks) => {
  const arrayOfPromises = [];
  arrayOfLinks.forEach((link) => {
    const promise = new Promise((resolve) => {
      axios
        .get(link.href)
        .then((response) => {
          const { status, statusText } = response;
          link["status"] = status;
          link["statusText"] = statusText;
          resolve(link);
        })
        .catch((err) => {
          if (err.response) {
            link["status"] = err.response.status; //404 o mayores a este
            link["statusText"] = "FAIL";
          } else if (err.request) {
            link["status"] = null;
            link["statusText"] = `${"HTTP Error request:"} ${err.message}`; // en caso la petición http no sea exitosa
          } else {
            link["status"] = null; //si el link es un hipervinculo es null
          }
          resolve(link);
        });
    });
    arrayOfPromises.push(promise);
  });
  return Promise.all(arrayOfPromises);
};
const statistics = (arrayOfLinks) => {
  return new Promise((validate) => {
    const stats = {};
    stats["Total"] = arrayOfLinks.length;
    const hrefs = arrayOfLinks.map((link) => link.href);
    const unique = [...new Set(hrefs)];
    stats["Unique"] = unique.length;
    validate(stats);
  });
};
const statsAndValidate = (arrayOfLinksWithStatus) => {
  return new Promise((resolve) => {
    statistics(arrayOfLinksWithStatus).then((stats) => {
      let broken = 0;
      arrayOfLinksWithStatus.forEach((link) =>
        link.status >= 400 ? (broken += 1) : false
      );
      stats["Broken"] = broken;
      resolve(stats);
    });
  });
};

const cases = (options, dataFile, pathAbsolute) => {
  const { validate, stats } = options;
  if (!options) {
    return new Promise((resolve) => {
      resolve(arrayOfLinks(dataFile, pathAbsolute));
    });
  } else if (validate && !stats) {
    return arrayOfLinksWithStatus(arrayOfLinks(dataFile, pathAbsolute));
  } else if (stats && !validate) {
    return statistics(arrayOfLinks(dataFile, pathAbsolute));
  } else if (validate && stats) {
    return arrayOfLinksWithStatus(arrayOfLinks(dataFile, pathAbsolute)).then(
      (result) => statsAndValidate(result)
    );
  } else {
    return false;
  }
};
const ifPathIsDir = (dir, options) => {
  const arrayOfPromises = [];
  function crawl(dir) {
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      const next = path.resolve(path.join(dir, files[i]));
      if (fs.lstatSync(next).isDirectory() === true) {
        crawl(next);
      } else {
        let promise;
        let { ext } = path.parse(next);
        if (ext === ".md") {
          promise = new Promise((resolve) => {
            readFile(next)
              .then((dataFile) => cases(options, dataFile, next))
              .then((result) => {
                resolve(result);
              });
          });
        }
        arrayOfPromises.push(promise);
      }
    }
  }
  crawl(dir);
  return new Promise((resolve, reject) => {
    Promise.all(arrayOfPromises).then((result) => {
      const acum = result.reduce((acum, item) => {
        return acum.concat(item);
      }, []);
      if (result[0] === undefined) {
        reject(
          `${"ERROR:".red} Not found file(s) with 'md' extension at dir: ${dir}`
        );
      }
      resolve(acum);
    });
  });
};
module.exports = {
  readFile,
  toPathAbsolute,
  arrayOfLinks,
  arrayOfLinksWithStatus,
  statistics,
  statsAndValidate,
  cases,
  ifPathIsDir,
};
