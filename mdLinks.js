const fs = require("fs"); // usando modulos COMMONJS
require("colors");
const { readFile, toPathAbsolute, cases, ifPathIsDir } = require("./api");

const mdLinks = (pathParameter, options = false) => {
  if (
    fs.existsSync(pathParameter) &&
    fs.lstatSync(pathParameter).isDirectory()
  ) {
    // si el path es un directorio
    return ifPathIsDir(pathParameter, options);
  } else {
    const pathAbsolute = toPathAbsolute(pathParameter);
    return readFile(pathAbsolute).then((dataFile) =>
      cases(options, dataFile, pathAbsolute)
    );
  }
};
module.exports = mdLinks;
