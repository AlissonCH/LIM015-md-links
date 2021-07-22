const fs = require("fs"); // usando modulos COMMONJS
const path = require("path");
const markDownIt = require("markdown-it");
const markdownLinkExtractor = require("markdown-link-extractor");

function toPathAbsolute(pathParameter) {
  // console.log(pathParameter)
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
  } else if (path.isAbsolute(newPath) === false) {
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
  console.log(pathAbsolute);
  return pathAbsolute;
}

function extractLinks(fyle) {
  // const md = new markDownIt();
  // const result = md.render(fyle);
  const links = markdownLinkExtractor(fyle, true);
  links.forEach((link) => console.log(link));
}

// module.exports = () => {
const mdLinks = (pathParameter, options = false) => {
  /*const arrayOfLinks = () => {
    const array = new Array;
    const absolutePath = () => {} // convertir la ruta relativa en absoluta
    // recorrer todo el archivo y almacenar los links y text en array
    // se recorre cada link del array y se forman los objetos
    // validacion true o false de validate dentro del bucle for()
      if(options.validate){
        // peticion http con status
        // se agrega propiedad status dentro del objeto
        // se agrega ok o fail por cada respuesta http
        return array; 
      } else{ 
        return array;
      }

  }*/
  // leer documento readme y extraer links y text y ponerlos en un array;
  // agregar el file dentro de cada objeto del arrayOfLinks
  // function status de cada link
  // arrayOfLinks.push({file:path});
  // options.validate sea true analizar cada link http y pushear el status dentro de un arrayOfLinks
  return new Promise((resolve, reject) => {
    fs.readFile(toPathAbsolute(pathParameter), "utf-8", (error, fyle) => {
      if (error) {
        reject(`ERROR AL LEER RUTA ${error}`);
      } else {
        resolve(extractLinks(fyle));
      }
    });
  });
};
// }

// mdLinks('..\\LIM015-cipher\\readme.md', {validate: true}) // path relativo print: ..\LIM015-cipher\readme.md
//     .then(links => console.log(links))
//     .catch(console.error);
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
