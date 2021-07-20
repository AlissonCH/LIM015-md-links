
const fs = require('fs'); // usando modulos COMMONJS
const path = require('path');

function toPathAbsolute (pathParameter) {
  let pathAbsolute;
  if (path.isAbsolute(pathParameter)){
    // console.log('path es absoluto');
    let { root, dir, base, ext , name} = path.parse(pathParameter);
    ext===''? ext='.md': ext;
    base = name + ext;
    pathAbsolute = path.join(dir,base);

  } else if (path.isAbsolute(pathParameter)===false){

    // console.log('path es relativo');
    const cwd = process.cwd(); //path.dirname(__filename);
    let { root, dir, base, ext, name} = path.parse(pathParameter);
    (ext==='')? ext='.md' : ext
    base = name + ext;
    // console.log(path.parse(pathParameter));
    (dir!=='') 
    ? pathAbsolute = path.join(dir,base) 
    : pathAbsolute = path.join(cwd,base);
  } else {
  //  console.log('path es otra cosa');
  //   const [ , ,pathInput] = pathParameter;
  //   console.log(pathInput);
  //   const normalize = path.normalize(pathInput)
  //   console.log(normalize);
  }
  console.log(pathAbsolute);
  return pathAbsolute;
}


// module.exports = () => {
  const mdLinks = (pathParameter, options = false) => {
    // toPathAbsolute(pathParameter);
    // console.log(toPathAbsolute(pathParameter));
    // console.log(dir);
    // console.log(pathObject);
    
      //validation path si existe
      // return Boolean
    
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
    //path existe? valor true o false
    // function convertir ruta relativas a absolutas
    // leer documento readme y extraer links y text y ponerlos en un array;
    // agregar el file dentro de cada objeto del arrayOfLinks
    // function status de cada link
    // arrayOfLinks.push({file:path});
    // options.validate sea true analizar cada link http y pushear el status dentro de un arrayOfLinks

    // path = process.argv //obtener parametros desde CLI
    // console.log(path)
    // const [ ,arg2,arg3] = process.argv;
    // console.log(arg2);
    // console.log(arg3);
    // const rootPath = path.dirname(arg2);
    // console.log(rootPath);
    // const [...rest] = arg2.split('\\');
    return new Promise( (resolve, reject) => {
      fs.readFile(toPathAbsolute(pathParameter), 'utf-8', (error, fyle) => {
        if(error){
          reject(`ERROR AL LEER RUTA ${error}`);
        }else{
          resolve('el archivo se lee ok');
        } 
      })
    })
  }
// }

mdLinks('..\\LIM015-cipher\\readme.md', {validate: true}) // path relativo print: ..\LIM015-cipher\readme.md
    .then(links => console.log(links))
    .catch(console.error);
mdLinks('readme.md', {validate: true}) // path relativo print: C:\Users\aliss\Desktop\Proyectos-laboratoria\LIM015-md-links\readme.md
    .then(links => console.log(links))
    .catch(console.error);  
mdLinks('./readme', {validate: true}) // path relativo a su propio directorio print: readme.md
    .then(links => console.log(links))
    .catch(console.error);  
mdLinks('C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\LIM015-card-validation\\readme', {validate: true}) // path absoluto C:\Users\aliss\Desktop\Proyectos-laboratoria\LIM015-card-validation\readme.md
    .then(links => console.log(links))
    .catch(console.error);  
mdLinks('C:/Users/aliss/Desktop/Proyectos-laboratoria/LIM015-card-validation/readme.md', {validate: true}) // path absoluto C:\Users\aliss\Desktop\Proyectos-laboratoria\LIM015-card-validation\readme.md
    .then(links => console.log(links))
    .catch(console.error);  


