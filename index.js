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
  const renderFile = md.render(dataFile);
  const dom = new JSDOM(renderFile);
  const a = dom.window.document.querySelectorAll("a"); // 'NodeList'
  const arrayOfLinks = new Array();
  a.forEach((a) => {
    const { href, text } = a;
    const link = {};
    link["href"] = href;
    link["text"] = text;
    link["file"] = pathAbsolute;
    arrayOfLinks.push(link);
  });
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
          link["statusText"] = statusText;
          link["status"] = status;
          resolve(link);
        })
        .catch((err) => {
          if (err.response) {
            link["status"] = err.response.status; //404
            link["statusText"] = "FAIL";
          } else if (err.request) {
            link["status"] = err.message; //mensaje de error
            link["statusText"] = "FAIL";
          } else {
            link["status"] = `ERROR:${err.message}`; //mensaje de error
            link["statusText"] = "FAIL";
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
      arrayOfLinksWithStatus.forEach((link) => {
        if (link["status"] === 404 || link["status"] === 410) {
          broken = broken + 1;
        }
      });
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
        let { ext } = path.parse(next);
        if (ext === ".md") {
          let promise = new Promise((resolve) => {
            readFile(next)
              .then((dataFile) => cases(options, dataFile, next))
              .then((result) => {
                resolve(result);
              });
          });
          arrayOfPromises.push(promise);
        }
      }
    }
  }
  crawl(dir);
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err) => {
      if (err) {
        reject(`${"ERROR:".red} ${err}`);
      }
    });
    Promise.all(arrayOfPromises).then((result) => {
      const acum = result.reduce((acum, item) => {
        return acum.concat(item);
      }, []);
      resolve(acum);
    });
  });
}

const mdLinks = (pathParameter, options = false) => {
  let newPath = pathParameter;
  if (
    fs.existsSync(pathParameter) &&
    fs.lstatSync(pathParameter).isDirectory()
  ) {
    // si el path es un directorio
    return ifPathIsDir(pathParameter, options);
  } else {
    const pathAbsolute = toPathAbsolute(newPath);
    return readFile(pathAbsolute).then((dataFile) =>
      cases(options, dataFile, pathAbsolute)
    );
  }
};
module.exports = mdLinks;

// mdLinks(process.argv[2], { stats: true })
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

// mdLinks("C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\readme.md", {
//   validate: true,
// })
//   .then((links) => console.log(links))
//   .catch((err) => console.log(err));

// .then((links) => console.log(links))
// .catch(console.error);
// mdLinks('readme.md', {validate: true}) // path relativo print: C:\Users\aliss\Desktop\Proyectos-laboratoria\LIM015-md-links\readme.md
//     .then(links => console.log(links))
//     .catch(console.error);
// mdLinks('./readme', {validate: true}) // path relativo a su propio directorio print: readme.md
//     .then(links => console.log(links))
//     .catch(console.error);
// mdLinks('C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\LIM015-card-validation\\readme', {validate: true}) // path absoluto C:\Users\aliss\Desktop\Proyectos-laboratoria\LIM015-card-validation\readme.md
//     .then(links => console.log(links))
//     .catch(console.error);
// mdLinks('C:\\Users\\aliss\\Desktop\\proyecto prueba\\readme', {validate: true}) // path absoluto C:\Users\aliss\Desktop\Proyectos-laboratoria\LIM015-card-validation\readme.md
//     .then(links => console.log(links))
//     .catch(console.error);
// mdLinks(process.argv, { validate: true }) // cuando se recibe el argumento por consola el path debe ser un string.
//   .then((links) => console.log(links))
//   .catch(console.error);
