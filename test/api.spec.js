/* eslint-disable no-undef */
const {
  readFile,
  toPathAbsolute,
  arrayOfLinks,
  arrayOfLinksWithStatus,
  statistics,
  statsAndValidate,
  cases,
  ifPathIsDir,
} = require("../api");
const pathA =
  "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\cipher.md";
const pathB =
  "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\noExiste.md";
const pathC =
  "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\rprueba.md";
const pathD =
  "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\rprueba2.md";
const pathE =
  "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\rprueba3.md";
describe("readFile", () => {
  it("fileData is an string", () => {
    return readFile(pathA).then((fileData) => {
      expect(typeof fileData).toBe("string");
    });
  });
  it("fileData is a String and containg '#' ", () => {
    return readFile(pathA).then((fileData) => {
      expect(fileData).toMatch(/#/);
    });
  });
  it("readFile fails with an error ", () => {
    expect.assertions(1);
    return readFile(pathB).catch((e) => expect(e).toMatch(/ERROR/));
  });
});
describe("toPathAbsolute", () => {
  it("should return an absolute Path", () => {
    expect(toPathAbsolute("..\\prueba\\cipher.md")).toBe(pathA);
  });
  it("is Path is Absolute should return the same Path", () => {
    expect(toPathAbsolute(pathA)).toBe(pathA);
  });
  it("is file not has 'md' ext in path, it return path absolute with 'md' ext ", () => {
    expect(toPathAbsolute("readme")).toMatch(/.md/);
  });
  it(`should be "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\cipher.md" to "..//prueba//cipher"`, () => {
    expect(toPathAbsolute("..//prueba//cipher")).toBe(pathA);
  });
  it(`should be "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\LIM015-md-links\\readme.md" to "./readme"`, () => {
    expect(toPathAbsolute("./readme")).toBe(
      "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\LIM015-md-links\\readme.md"
    );
  });
});
describe("arrayOfLinks", () => {
  it("should be return an array", () => {
    return readFile(pathA).then((dataFile) => {
      expect(Array.isArray(arrayOfLinks(dataFile, pathA))).toBe(true);
    });
  });
  it(`object link should containing the following keys: 'href', 'text', 'file' `, () => {
    return readFile(pathA).then((dataFile) => {
      expect(arrayOfLinks(dataFile, pathA)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            href: expect.any(String),
            text: expect.any(String),
            file: expect.any(String),
          }),
        ])
      );
    });
  });
});
describe("arrayOfLinksWithStatus", () => {
  it("should be return an array", () => {
    return readFile(pathA).then((dataFile) => {
      arrayOfLinksWithStatus(arrayOfLinks(dataFile, pathA)).then((result) => {
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });
  it(`if link is hiperlink the 'status' should be null`, () => {
    return readFile(pathD).then((dataFile) => {
      return arrayOfLinksWithStatus(arrayOfLinks(dataFile, pathD)).then(
        (result) => {
          expect(result).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                status: null,
              }),
            ])
          );
        }
      );
    });
  });
});
describe("statistics", () => {
  it("should resolve an object which containing keys: 'Total', 'Unique'", () => {
    return readFile(pathA).then((dataFile) => {
      return statistics(arrayOfLinks(dataFile, pathA)).then((result) =>
        expect(result).toEqual(
          expect.objectContaining({
            Total: expect.any(Number),
            Unique: expect.any(Number),
          })
        )
      );
    });
  });
  it(`resolve an object: {'Total':6, 'Unique':4 }`, () => {
    return readFile(pathE).then((dataFile) => {
      return statistics(arrayOfLinks(dataFile, pathE)).then((result) =>
        expect(result).toEqual(
          expect.objectContaining({
            Total: 6,
            Unique: 4,
          })
        )
      );
    });
  });
});

describe("statsAndValidate", () => {
  it("should resolve an object which containing keys: 'Total', 'Unique', 'Broken'", () => {
    return readFile(pathC).then((dataFile) => {
      return arrayOfLinksWithStatus(arrayOfLinks(dataFile, pathC)).then(
        (result) => {
          return statsAndValidate(result).then((result) => {
            expect(result).toEqual(
              expect.objectContaining({
                Total: expect.any(Number),
                Unique: expect.any(Number),
                Broken: expect.any(Number),
              })
            );
          });
        }
      );
    });
  });
  it(`resolve an object: {'Total':4, 'Unique':4 , 'Broken:2}`, () => {
    return readFile(pathC).then((dataFile) => {
      return arrayOfLinksWithStatus(arrayOfLinks(dataFile, pathC)).then(
        (result) => {
          return statsAndValidate(result).then((result) => {
            expect(result).toEqual(
              expect.objectContaining({
                Total: 4,
                Unique: 4,
                Broken: 2,
              })
            );
          });
        }
      );
    });
  });
});

describe("Cases", () => {
  it("if options = false, should return an array of objects with key: 'href' ", () => {
    return readFile(pathC).then((dataFile) => {
      return cases(false, dataFile, pathC).then((array) => {
        expect(array).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              href: expect.any(String),
            }),
          ])
        );
      });
    });
  });
  it("if options = {validate:true}, should return an array of objects with key: 'status' ", () => {
    return readFile(pathC).then((dataFile) => {
      return cases({ validate: true }, dataFile, pathC).then((array) => {
        expect(array).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              status: expect.any(Number),
            }),
          ])
        );
      });
    });
  });
  it("if options = {stats:true}, should return an object with key: 'Total' ", () => {
    return readFile(pathC).then((dataFile) => {
      return cases({ stats: true }, dataFile, pathC).then((result) => {
        expect(result).toEqual(
          expect.objectContaining({
            Total: expect.any(Number),
          })
        );
      });
    });
  });
  it("if options = {stats:true, validate:true}, should return an object with key: 'Broken' ", () => {
    return readFile(pathC).then((dataFile) => {
      return cases({ stats: true, validate: true }, dataFile, pathC).then(
        (result) => {
          expect(result).toEqual(
            expect.objectContaining({
              Broken: expect.any(Number),
            })
          );
        }
      );
    });
  });
  it("if options = 'something', should return false ", () => {
    return readFile(pathC).then((dataFile) => {
      expect(cases("something", dataFile, pathC)).toBe(false);
    });
  });
});

describe("ifPathIsDir", () => {
  it(`should resolve an array`, () => {
    return ifPathIsDir(
      "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\interior1",
      false
    ).then((result) => {
      expect(Array.isArray(result)).toBe(true);
    });
  });
  it(`if options = {validate:true}, resolve array of object which should containing key:'status' `, () => {
    return ifPathIsDir(
      "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\interior2",
      { validate: true }
    ).then((result) => {
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            status: expect.any(Number),
          }),
        ])
      );
    });
  });
  it(`if options = {stats:true}, resolve array of object which should containing key:'Total' `, () => {
    return ifPathIsDir(
      "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\interior2",
      { stats: true }
    ).then((result) => {
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Total: expect.any(Number),
          }),
        ])
      );
    });
  });
  it(`if not found file(s) with 'md' ext, fails with an error  `, () => {
    expect.assertions(1);
    return ifPathIsDir(
      "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba 2"
    ).catch((e) => expect(e).toMatch(/ERROR/));
  });
});
