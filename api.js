const fs = require("fs"); // usando modulos COMMONJS
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
// const markdownLinkExtractor = require("markdown-link-extractor");

function readFile(pathAbsolute) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathAbsolute, "utf-8", (err, fileData) => {
      if (err) {
        reject(`${"ERROR: ".red} ${err}`);
      } else {
        resolve(fileData);
      }
    });
  });
}
function toPathAbsolute(pathFile) {
  let pathAbsolute;
  if (path.isAbsolute(pathFile)) {
    // path es absoluto
    let { dir, base, ext, name } = path.parse(pathFile);
    ext === "" ? (ext = ".md") : ext;
    base = name + ext;
    pathAbsolute = path.join(dir, base);
  } else {
    // path es relativo
    const cwd = process.cwd(); //otra forma path.dirname(__filename);
    let { dir, base, ext, name } = path.parse(pathFile);
    ext === "" ? (ext = ".md") : ext;
    base = name + ext;
    dir !== ""
      ? (pathAbsolute = path.resolve(path.join(dir, base)))
      : (pathAbsolute = path.join(cwd, base));
  }
  return pathAbsolute;
}

function arrayOfLinks(dataFile, pathAbsolute) {
  const renderFile = md.render(dataFile); // string to HTML
  const dom = new JSDOM(renderFile); // transform HTML to DOM
  const a = dom.window.document.querySelectorAll("a"); // 'NodeList'
  const img = dom.window.document.querySelectorAll("img"); // 'NodeList'
  const arrayOfLinks = new Array();
  a.forEach((a) => {
    const { href, text } = a;
    const link = {};
    link["href"] = href;
    link["text"] = text;
    link["file"] = pathAbsolute;
    arrayOfLinks.push(link);
  });
  if (img) {
    img.forEach((img) => {
      const { src, alt } = img;
      const link = {};
      link["href"] = src;
      link["text"] = alt;
      link["file"] = pathAbsolute;
      arrayOfLinks.push(link);
    });
  }
  return arrayOfLinks;
}
function arrayOfLinksWithStatus(arrayOfLinks) {
  const arrayOfPromises = [];
  arrayOfLinks.forEach((link) => {
    let promise = new Promise((resolve) => {
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
            link["statusText"] = `${"HTTP Error request:".red} ${err.message}`; // en caso la petición http no sea exitosa
          } else {
            link["status"] = null; //si el link es un hipervinculo es null
          }
          resolve(link);
        });
    });
    arrayOfPromises.push(promise);
  });
  return Promise.all(arrayOfPromises);
}
const statistics = (arrayOfLinks) => {
  return new Promise((validate) => {
    const total = arrayOfLinks.length;
    const stats = {};
    stats["Total"] = total;
    let unique = [];
    arrayOfLinks.forEach((link) => {
      let index = unique.indexOf(link["href"]);
      // console.log(index);
      if (index === -1) {
        unique.push(link["href"]);
      }
    });
    stats["Unique"] = unique.length;
    validate(stats);
  });
};
const statsAndValidate = (arrayOfLinksWithStatus) => {
  return new Promise((resolve) => {
    statistics(arrayOfLinksWithStatus).then((stats) => {
      let broken = 0;
      // let errorRequest = 0;
      arrayOfLinksWithStatus.forEach((link) => {
        if (link["status"] >= 400) {
          broken = broken + 1;
          // } else if (!link["statusText"]) {
          //   errorRequest += 1;
        }
      });
      // stats["ErrorRequest"] = errorRequest;
      stats["Broken"] = broken;
      resolve(stats);
    });
  });
};

function cases(options, dataFile, pathAbsolute) {
  let { validate, stats } = options;
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
}
function ifPathIsDir(dir, options) {
  const arrayOfPromises = [];
  function crawl(dir) {
    let files = fs.readdirSync(dir);
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
    // fs.stat(dir, (err) => {
    //   if (err) {
    //     console.log("holi");
    //     reject(`${"ERROR:".red} ${err}`);
    //   }
    // });
    Promise.all(arrayOfPromises).then((result) => {
      const acum = result.reduce((acum, item) => {
        return acum.concat(item);
      }, []);
      if (result[0] === undefined) {
        reject(
          `${"ERROR:".red} Not found file(s) with 'md' ext at dir: ${dir}`
        );
      }
      resolve(acum);
    });
  });
}
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
