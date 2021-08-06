const fs = require("fs"); // usando modulos COMMONJS
require("colors");
const api = require("./api");
const mdLinks = (pathParameter, options = false) => {
  pathParameter;
  if (
    fs.existsSync(pathParameter) &&
    fs.lstatSync(pathParameter).isDirectory()
  ) {
    // si el path es un directorio
    return api.ifPathIsDir(pathParameter, options);
  } else {
    const pathAbsolute = api.toPathAbsolute(pathParameter);
    return api
      .readFile(pathAbsolute)
      .then((dataFile) => api.cases(options, dataFile, pathAbsolute));
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
