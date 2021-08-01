#!/usr/bin/env node
const mdLinks = require("./index");
// cuando se recibe el argumento por consola el path debe ser un string.
mdLinks(process.argv, { validate: true })
  .then((links) => console.log(links))
  .catch((err) => console.log(err));
