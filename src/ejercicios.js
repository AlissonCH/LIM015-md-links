// setTimeout(() => console.log('Hola Mundo'), 1000);
// const getUsuarioById = (id, callback) =>{
//   const user = {
//     id,
//     nombre: 'Alisson',
//     apellido: 'Cruz',
//     correo: 'alissoncruz1397@gmail.com'
//   }
//   setTimeout( () => callback(user), 1500);
// }

// getUsuarioById(10, ({id, nombre, apellido, correo}) => {
//   const apellidoToUpperCase = apellido.toUpperCase();
//   const nombreToUpperCase = nombre.toUpperCase();
//   console.log(id, nombreToUpperCase, nombre, apellidoToUpperCase, apellido, correo);
// });

// Callback hells

const empleados = [
  {
    id: 1,
    nombre: "Camila",
  },
  {
    id: 2,
    nombre: "Fernando",
  },
  {
    id: 3,
    nombre: "Rosa",
  },
];
const salarios = [
  {
    id: 1,
    salario: 1500,
  },
  {
    id: 2,
    salario: 2500,
  },
];

// const getEmpleado = (id, callback) => {
//   const empleado = empleados.find((e) => e.id === id)?.nombre;
//   if (empleado){
//     return callback( null, empleado);
//   } else{
//     return callback(`Empleado con id: ${id} no existe`);
//   }
// }

// const getSalario = (id, callback) => {
//   const salario = salarios.find(e => e.id === id)?.salario;
//   if (salario){
//     return callback(null, salario);
//   }else {
//     return callback(`El empleado con id ${id} no existe y no hay salario`);
//   }
// };

// const id = 3
// getEmpleado(id, (err, empleado) => {
//   if(err){
//     return console.log(err);
//   }
//   getSalario(id, (err, salario) => {
//     if(err){
//       return console.log(err);
//     }
//     console.log('El empleadx', empleado, 'tiene un salario de:',salario);
//   })
// })

//Promesas
const getEmpleado = (id) => {
  const empleado = empleados.find((e) => e.id === id)?.nombre;
  return new Promise((resolve, reject) => {
    empleado
      ? resolve(empleado)
      : reject(`El empleado con id: ${id} no existe`);
  });
};

const getSalario = (id) => {
  const salario = salarios.find((e) => e.id === id)?.salario;
  return new Promise((resolve, reject) => {
    salario
      ? resolve(salario)
      : reject(`El salario del empleado con el id: ${id} no existe`);
  });
};

const id = 1;

// getEmpleado(id)
//  .then(empleado => {
//    array.push(empleado)
//    return console.log(array);
//   })
//  .catch(err => console.log(err));

// getSalario(id)
//  .then(salario => {
//    array.push(salario)
//    return console.log(array);
//  })
//  .catch(err => console.log(err))

// getEmpleado(id)
//  .then(empleado => {
//     array.push(empleado);
//     getSalario(id)
//       .then(salario => {
//         array.push(salario);
//         console.log(array);
//       })
//       .catch(err => console.log(err));
//   })

//  .catch(err => console.log(err));

//Contanecación de promesas

//  getEmpleado(id)
//   .then( empleado => {
//     array.push(empleado);
//     return getSalario(id);
//   })
//   .then( salario => {
//     array.push(salario);
//     return console.log(array);
//   })
//   .catch(err=>console.log(err))
const findHighest = (arrayOfNumbers) => {
  let max = arrayOfNumbers[0];
  arrayOfNumbers.forEach((num) => {
    if (num > max) {
      max = num;
    }
  });
  return max;
};
// console.log(findHighest([0, 12, 4, 87]));

const singleOccurrence = (string) => {
  const arrayCharacters = string.split("");
  const object = new Object();
  arrayCharacters.forEach((character) => {
    if (object[character]) {
      object[character] += 1;
    } else {
      object[character] = 1;
    }
  });
  let newString = "";
  for (let key in object) {
    object[key] === 1 ? (newString = key.toUpperCase()) : newString;
  }
  return newString;
};
console.log(singleOccurrence("s"));
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
