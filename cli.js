#!/usr/bin/env node
const fs = require("fs");
require("colors");
const mdLinks = require("./index");

const usageMessage = () => {
  const message = `
  ${"=========================================================".blue}
  ${"                     MD-LINKS USAGE".blue}
  ${"=========================================================".blue}
  md-links${`[<path>]`.blue}
  md-links${`[<path>]`.blue} ${`[--validate]`.blue}
  md-links${`[<path>]`.blue} ${`[--stats]`.blue}
  md-links${`[<path>]`.blue} ${`[--stats]`.blue} ${`[--validate]`.blue}

  Description of arguments:
  ${
    `[<path]`.blue
  }                   Must be a string, it can be file with extension '.md' or dir 
  ${`[--validate]`.blue}              Http status request for each link in md
  ${`[--stats]`.blue}                 General statistics of links
  ${`[--stats]`.blue} ${
    `[--validate]`.blue
  }    Statistics of links with links with http request

  For example: 
      md-links ${"readme.md".blue} <path>
      md-links ${"readme.md".blue} <path> ${`--validate`.blue}
      md-links ${"C:\\A\\B\\readme.md".blue} <path> ${`--stats`.blue}
      md-links ${"C:\\A\\B\\".blue} <path> ${`--stats --validate`.blue}
  `;
  return message;
};

function options() {
  let secondArgument = process.argv[3];
  let thirdArgument = process.argv[4];
  if (!secondArgument) {
    return false;
  } else {
    if (secondArgument == "--validate" && !thirdArgument) {
      return { validate: true };
    } else if (secondArgument == "--stats" && !thirdArgument) {
      return { stats: true };
    } else if (secondArgument == "--stats" && thirdArgument == "--validate") {
      return { stats: true, validate: true };
    } else {
      return usageMessage();
    }
  }
}

const showStatsInCli = (result) => {
  return console.log(`
${"Total: ".blue} ${result["Total"]}
${"Unique: ".blue} ${result["Unique"]}
${result["Broken"] ? `${"Broken".blue} ${result["Broken"]}` : ""}
${
  result["ErrorRequest"]
    ? `${"Error Request:".red} ${result["ErrorRequest"]}`
    : ""
}`);
};

function acum(result) {
  const acum = result.reduce(
    ({ Total = 0, Unique = 0, Broken = 0, ErrorRequest = 0 }, item) => {
      Total += item.Total;
      Unique += item.Unique;
      Broken += item.Broken;
      ErrorRequest += item.ErrorRequest;
      return { Total, Unique, Broken, ErrorRequest };
    },
    {}
  );
  return acum;
}
const showResultsInCli = (result) => {
  if (!Array.isArray(result)) {
    // result  array false
    return showStatsInCli(result);
  } else {
    // result es un array true
    if (result[0]["Total"]) {
      return showStatsInCli(acum(result));
    } else if (result[0] === false) {
      return console.log(usageMessage());
    } else {
      return result.forEach((item) => {
        console.log(
          `${item["file"]}`,
          `${item["href"]}`.blue,
          `${item["text"]}`,
          `${item["statusText"] ? item["statusText"] : ""}`.magenta,
          `${item["status"] ? item["status"] : ""}`.green
        );
      });
    }
  }
};
function cli() {
  let firstArgument = process.argv[2];
  if (firstArgument) {
    mdLinks(firstArgument, options())
      .then((result) => {
        if (!result) {
          const message = options();
          return console.log(message);
        } else {
          showResultsInCli(result);
        }
      })
      .catch((err) => console.error(err));
  } else {
    const usageMessage = usageMessage();
    return console.log(usageMessage);
  }
}

cli();

// const showMenu = () => {
//   return new Promise((resolve) => {
//     console.clear();
//     console.log(
//       "=========================================================".blue
//     );
//     console.log("               Path es un directorio\n".blue);
//     console.log("               SELECCIONE UNA OPCIÓN".bold.blue);
//     console.log(
//       "=========================================================\n".blue
//     );
//     console.log(`${`1`.blue}. Listar todos los archivos readme del directorio`);
//     console.log(`${`0`.blue}. Salir \n`);

//     const readLine = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     readLine.question("Seleccione una opción: ", (opt) => {
//       readLine.close();
//       resolve(opt);
//     });
//   });
// };
// const pausa = () => {
//   return new Promise((resolve) => {
//     const readLine = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readLine.question(`\n Presione ${`ENTER`.blue} para continuar \n`, () => {
//       readLine.close();
//       resolve();
//     });
//   });
// };
// const selectFilePath = () => {
//   return new Promise((resolve) => {
//     const readLine = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readLine.question(
//       `\n Seleccione una opción con extensión 'md' para continuar `.blue,
//       (opt) => {
//         readLine.close();
//         resolve(opt);
//       }
//     );
//   });
// };

// const selectOption = () => {
//   return new Promise((resolve) => {
//     const readLine = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readLine.question(
//       `\n Escriba ${`--validate`.blue}, ${`--stats`.blue} ,${
//         `--validate--stats`.blue
//       } después del path para continuar: `,
//       (opt) => {
//         readLine.close();
//         resolve(opt);
//       }
//     );
//   });
// };

// const cliOne = () => {
//   const path = process.argv[2];
//   console.clear();
//   if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
//     // console.log("path es un dir ");
//     let option = "";
//     showMenu()
//       .then((opt) => {
//         option = opt;
//         return mdLinks(path);
//       })
//       .then((listOfMd) => {
//         if (option === "1") {
//           for (let key in listOfMd) {
//             console.log(`${key.blue}: ${listOfMd[key]}`);
//           }
//           selectFilePath().then((optFile) => {
//             for (let key in listOfMd) {
//               if (optFile === key) {
//                 console.log(optFile.blue, listOfMd[optFile]);
//                 options().then((opt) => {
//                   console.log(opt);
//                   if (opt === "--validate") {
//                     console.log("obteniendo http status...");
//                     mdLinks(listOfMd[optFile], { validate: true }).then(
//                       (links) => console.log(links)
//                     );
//                   } else if (opt === "--stats") {
//                     mdLinks(listOfMd[optFile], { stats: true }).then((links) =>
//                       console.log(links)
//                     );
//                   } else if (opt === "--validate--stats") {
//                     mdLinks(listOfMd[optFile], {
//                       validate: true,
//                       stats: true,
//                     }).then((links) => console.log(links));
//                   } else {
//                     mdLinks(listOfMd[optFile]).then((links) =>
//                       console.log(links)
//                     );
//                   }
//                 });
//               }
//             }
//           });
//         } else if (option === "0") {
//           console.log("Salir");
//           pausa();
//         } else {
//           showMenu();
//         }
//       });
//   } else if (process.argv[3]) {
//     console.clear();
//     const option = process.argv[3];
//     console.log(option);
//     if (option === "--validate") {
//       console.log("Obteniendo https status por cada link...");
//       mdLinks(path, { validate: true })
//         .then((links) => {
//           console.log(links);
//         })
//         .catch((err) => console.log(err));
//     } else if (option === "--stats") {
//       mdLinks(path, { stats: true })
//         .then((result) => console.log(result))
//         .catch((err) => console.log(err));
//     } else if (option === "--validate--stats") {
//       mdLinks(path, { validate: true, stats: true })
//         .then((result) => console.log(result))
//         .catch((err) => console.log(err));
//     } else {
//       console.log(
//         `Escriba ${`--validate`.blue}, ${`--stats`.blue}, ${
//           `--validate--stats`.blue
//         } después del path para continuar
//         POR EJEMPLO:
//         - md-links '<path>' ${`--validate`.blue}
//         - md-links '<path>' ${`--stats`.blue}
//         - md-links '<path>' ${`--validate--stats`.blue}
//         `
//       );
//       // selectOption();
//     }
//   } else if (process.argv[2] && !process.argv[3]) {
//     // console.clear();
//     mdLinks(path)
//       .then((links) => console.log(links))
//       .catch((err) => {
//         console.log(`${err}
//         Ingrese:
//         md-links ${`readme.md`.blue}<path> ${`--validate`.blue}, ${
//           `--stats`.blue
//         } o ${`--validate--stats`.blue} <option>
//         `);
//       });
//   } else {
//     console.log(`
//     ERROR: Ingrese un string <PATH> para continuar
//     POR EJEMPLO:
//     - md-links ${`"readme"`.blue} <path>
//     - md-links ${`"readme.md"`.blue} <path>
//     - md-links ${`"C:\\aa\\bb\\cc\\dd\\ee\\readme.md"`.blue} <path>
//     - md-links ${`".\\readme.md"`.blue} <path>
//     - md-links ${`"..\\readme.md"`.blue} <path>
//     - md-links ${`".\\"`.blue} <path>`);
//   }
//   // console.log({ opt });
//   // pausa();

//   // mostrarMenu();
//   // pausa();
//   // return mdLinks(path).then((links) => console.log(links));
// };
