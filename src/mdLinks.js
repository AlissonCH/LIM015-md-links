const fs = require("fs"); // usando modulos COMMONJS
require("colors");
const { readFile, toPathAbsolute, cases, arrayOfMdFiles } = require("./api");

const mdLinks = (pathParameter, options = false) => {
  if (
    fs.existsSync(pathParameter) &&
    fs.lstatSync(pathParameter).isDirectory()
  ) {
    // si el path es un directorio
    const mdFiles = arrayOfMdFiles(pathParameter);
    const arrayOfPromises = [];
    mdFiles.forEach((mdFile) => {
      arrayOfPromises.push(readFile(mdFile));
    });
    return Promise.all(arrayOfPromises).then((dataFile) => {
      const dataFileAcum = dataFile.join("");
      return cases(options, dataFileAcum, pathParameter);
    });
  } else {
    const pathAbsolute = toPathAbsolute(pathParameter);
    return readFile(pathAbsolute).then((dataFile) =>
      cases(options, dataFile, pathAbsolute)
    );
  }
};
module.exports = mdLinks;
