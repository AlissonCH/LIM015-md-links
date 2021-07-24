#!/usr/bin/env node
const mdLinks = require("./index");

mdLinks(process.argv) // cuando se recibe el argumento por consola el path debe ser un string.
  .then((links) => console.log(links))
  .catch(console.error);
