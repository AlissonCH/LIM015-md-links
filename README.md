# alicruz-mdlinks

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

alicruz-mdlinks is a module and command-line interface that verifies the links that a markdown file contains, validates that they are unbroken, and reports some statistics.
[Github repository](https://github.com/AlissonCH/alicruz-mdlinks)

## Installation

It is recommendable global install, to use both: API and command-line interface correctly.

### npm module

[alicruz-mdlinks](https://www.npmjs.com/package/alicruz-mdlinks)

```bash
$ npm install --global alicruz-mdlinks
```

## API

Parameters:

- ``path`` absolute or relative path with a markdown file. Or directory with markdown files. It is recommended that the path be a string to avoid path recognition problems in different execution environments.
- ``options`` is an object, the default value is false.

Returns:

- An array containing objects for each link found. Each Link containing the following properties : 'href': (url), 'text' : (text associated to the link) , 'file' : (path where the links were found).
- when  ``options`` = { validate : true }. Each Link containing the following properties : 'href', 'text', 'file', 'status', 'statusText'.
- when  ``options`` = { stats : true } returns an object with the following properties : 'Total': (the total links found), 'Unique': (unique links).
- when  ``options`` = { stats : true, validate : true } returns an object with the following properties : 'Total': (Total links found), 'Unique': (Unique links ), 'Broken: (Broken links found).

### Examples

```javascript
const mdLinks = require('../alicruz-mdlinks');

mdLinks('./some/example.md').then( links => {
 // => [{ href, text, file }, ...]
})
.catch( err => console.error(err))

mdLinks('./some/example.md', {validate : true }).then( links => {
 // => [{ href, text, file, status, statusText}, ...]
})
.catch( err => console.error(err))

mdLinks('./some/dir').then( links => {
 // => [{ href, text, file}, ...]
})
.catch( err => console.error(err))

mdLinks('./some/dir', {validate : true}).then(arrayOfLinks => {
 // => [{ href, text, file, status, statusText}, ...]
})
.catch( err => console.error(err))

mdLinks('./some/example.md', {stats : true }).then(arrayOfLinks => {
 // => {Total, Unique}
})
.catch( err => console.error(err))

mdLinks('./some/example.md', {stats : true, validate:true }).then(arrayOfLinks => {
 // => {Total, Unique, Broken}
})
.catch( err => console.error(err))

```

### RESPONSE

### Examples

```javascript
mdLinks('./some/example.md').then( links => console.log(links))

// Console
[
 { href : 'http://somelink.com', 
   text : 'Some Link', 
   file: './some/example.md'
 },
 { href : 'http://otherthing.com', 
   text : 'Other Thing', 
   file: './some/example.md'
 },
 { href : 'http://google.com ', 
   text : 'Google', 
   file: './some/example.md'
 }
]

mdLinks('./some/example.md', {validate : true}).then( links => console.log(links))

// Console
[
 { href : 'http://somelink.com', 
   text : 'Some Link', 
   file: './some/example.md'
   status: 200,
   statusText : 'OK'
 },
 { href : 'http://otherthing.com', 
   text : 'Other Thing', 
   file: './some/example.md',
   status: 400,
   statusText : 'FAIL'
 },
 { href : 'http://google.com ', 
   text : 'Google', 
   file: './some/example.md',
   status: 200,
   statusText : 'OK'
 }
]

mdLinks('./some/example.md', {stats : true}).then( result => console.log(result))

// Console
 { 
  Total: 3, 
  Unique: 3
 }  

mdLinks('./some/example.md', {stats : true, vaidate: true}).then( result => console.log(result))

// Console
 { 
  Total: 3, 
  Unique: 3,
  Broken: 1
 } 
```

## COMMAND LINE INTERFACE - CLI

``md-links <path-to-file> [options] ``

### Examples

```javascript
$ md-links './some/example.md'
./some/example.md http://somelink.com Some Link
./some/example.md http://otherthing.com Other Thing
./some/example.md http://google.com Google
./some/example.md http://google.com Google

$ md-links './some/example.md' --validate 
./some/example.md http://somelink.com OK 200 Some Link 
./some/example.md http://otherthing.com FAIL 400 Other Thing
./some/example.md http://google.com OK 200 Google
./some/example.md http://google.com OK 200 Google

$ md-links './some/example.md' --stats
Total : 4
Unique : 3

$ md-links './some/example.md' --stats --validate
Total : 4
Unique : 3
Broken : 1
```
## Contributing
Pull requests are welcome. For major changes, please open an [issues](https://github.com/AlissonCH/alicruz-mdlinks/issues) first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)