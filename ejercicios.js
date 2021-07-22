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
