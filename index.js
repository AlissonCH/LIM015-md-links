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
// const markdownLinkExtractor = require("markdown-link-extractor");

function listOfMd(dir) {
  const listOfMd = new Object();
  let index = 0;
  function crawl(dir) {
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      const next = path.resolve(path.join(dir, files[i]));
      if (fs.lstatSync(next).isDirectory() === true) {
        crawl(next);
      } else {
        let { ext } = path.parse(next);
        if (ext === ".md") {
          listOfMd[index++] = next;
        }
      }
    }
  }
  crawl(dir);
  return listOfMd;
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
  // .then((result) => result);
}
const stats = () => {
  return;
};
function cases(options, dataFile, pathAbsolute) {
  let { validate, stats } = options;
  if (!options) {
    return new Promise((resolve, reject) => {
      resolve(arrayOfLinks(dataFile, pathAbsolute));
    });
  } else if (validate && !stats) {
    return arrayOfLinksWithStatus(arrayOfLinks(dataFile, pathAbsolute));
    // .then(
    //   (arrayOfLinksWithStatus) => arrayOfLinksWithStatus
    // );
  } else if (stats && !validate) {
    return stats();
  } else {
    return "ambos son true";
  }
}

const readFile = (pathAbsolute) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathAbsolute, "utf-8", (err, fileData) => {
      if (err) {
        reject(`ERROR AL LEER LA DATA ${err}`);
      } else {
        resolve(fileData);
      }
    });
  });
};

const mdLinks = (pathParameter, options = false) => {
  let newPath;
  Array.isArray(pathParameter) // si entra como argumento de consola se toma el index 2 del array
    ? (newPath = pathParameter[2])
    : (newPath = pathParameter);

  if (fs.existsSync(newPath) && fs.lstatSync(newPath).isDirectory()) {
    // si el path es un directorio
    return new Promise((resolve) => {
      resolve(listOfMd(newPath)); // objeto con listado de documentos '.md'
    });
  } else {
    const pathAbsolute = toPathAbsolute(newPath);
    return readFile(pathAbsolute)
      .then((dataFile) => cases(options, dataFile, pathAbsolute))
      .then((arrayOfLinks) => arrayOfLinks)
      .catch((err) => err);
  }
};
module.exports = mdLinks;

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
