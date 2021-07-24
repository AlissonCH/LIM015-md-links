const fs = require("fs"); // usando modulos COMMONJS
const path = require("path");
const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
});
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// const markdownLinkExtractor = require("markdown-link-extractor");

function toPathAbsolute(pathParameter) {
  let newPath;
  Array.isArray(pathParameter)
    ? (newPath = pathParameter[2])
    : (newPath = pathParameter); // si entra como argumento de consola es un array

  let pathAbsolute;
  if (path.isAbsolute(newPath)) {
    // path es absoluto
    let { root, dir, base, ext, name } = path.parse(newPath);
    ext === "" ? (ext = ".md") : ext;
    base = name + ext;
    pathAbsolute = path.join(dir, base);
  } else if (!path.isAbsolute(newPath)) {
    // path es relativo
    const cwd = process.cwd(); //path.dirname(__filename);
    let { root, dir, base, ext, name } = path.parse(newPath);
    ext === "" ? (ext = ".md") : ext;
    base = name + ext;
    dir !== ""
      ? (pathAbsolute = path.join(dir, base))
      : (pathAbsolute = path.join(cwd, base));
  } else {
    // path es un directorio
    console.log("path es otra cosa");
  }
  return pathAbsolute;
}

function arrayOfLinks(file, pathAbsolute) {
  const renderFile = md.render(file);
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
  arrayOfLinks.forEach((link) => {
    const { href } = link;
    link["ok"] = "ok";
  });
  return arrayOfLinks;
}

// const options = new Object();
const mdLinks = (pathParameter, options = false) => {
  let { validate, stats } = options;
  const pathAbsolute = toPathAbsolute(pathParameter);
  function cases(file) {
    if (!options) {
      return arrayOfLinks(file, pathAbsolute);
    } else if (validate) {
      return arrayOfLinksWithStatus(arrayOfLinks(file, pathAbsolute));
    } else if (stats) {
      return "stats es true";
    } else {
      return "otro caso";
    }
  }
  return new Promise((resolve, reject) => {
    fs.readFile(pathAbsolute, "utf-8", (error, file) => {
      if (error) {
        reject(`ERROR AL LEER LA RUTA${error}`);
      } else {
        resolve(cases(file));
      }
    });
  });
};

module.exports = mdLinks;

// mdLinks("..\\LIM015-cipher\\readme.md", { validate: true }) // path relativo print: ..\LIM015-cipher\readme.md
//   .then((links) => console.log(links))
//   .catch(console.error);
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
