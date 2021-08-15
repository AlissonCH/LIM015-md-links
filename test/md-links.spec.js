jest.mock("axios");
const mdLinks = require("../src/mdLinks");
const pathA =
  "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\rprueba.md";
const pathB =
  "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\rprueba";

const linkOk = "https://linkok1/";
const linkRoto = "http://linkroto/";
const failRequest = "http://failhttprequest/";
const hipervinculo = "about:blank#hipervinculo";

const links = [
  {
    href: linkOk,
    text: "Título1",
    file: pathA,
    line: 10,
  },
  {
    href: linkRoto,
    text: "TítuloRoto",
    file: pathA,
    line: 8,
  },
  {
    href: linkOk,
    text: "Título1",
    file: pathA,
    line: 10,
  },
  {
    href: failRequest,
    text: "TítuloFailHttpRequest",
    file: pathA,
    line: 12,
  },
  {
    href: hipervinculo,
    text: "TituloHipervinculo",
    file: pathA,
    line: undefined,
  },
  {
    href: linkOk,
    text: "Título1",
    file: pathA,
    line: 10,
  },
];
const linksWithStatus = [
  {
    href: linkOk,
    text: "Título1",
    file: pathA,
    status: 200,
    statusText: "OK",
    line: 10,
  },
  {
    href: linkRoto,
    text: "TítuloRoto",
    file: pathA,
    status: 400,
    statusText: "FAIL",
    line: 8,
  },
  {
    href: linkOk,
    text: "Título1",
    file: pathA,
    status: 200,
    statusText: "OK",
    line: 10,
  },
  {
    href: failRequest,
    text: "TítuloFailHttpRequest",
    file: pathA,
    status: null,
    statusText: "HTTP Error request: errorRequest",
    line: 12,
  },
  {
    href: hipervinculo,
    text: "TituloHipervinculo",
    file: pathA,
    status: null,
    line: undefined,
  },
  {
    href: linkOk,
    text: "Título1",
    file: pathA,
    status: 200,
    statusText: "OK",
    line: 10,
  },
];

describe("mdLinks", () => {
  it(`should return array of objects(links) to path "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\rprueba.md"`, () => {
    return mdLinks(pathB).then((result) => {
      expect(result).toEqual(
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
  it(`should return array of objects(links) to path "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\rprueba.md"`, () => {
    return mdLinks(pathA).then((result) => {
      expect(result).toEqual(links);
    });
  });
  it(`should be an array`, () => {
    return mdLinks(pathA).then((result) => {
      expect(Array.isArray(result)).toBe(true);
    });
  });
  it(`should return array of objects(links) with status, to path "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\rprueba.md"`, () => {
    return mdLinks(pathA, { validate: true }).then((result) => {
      expect(result).toEqual(linksWithStatus);
    });
  });

  it(`should return array of objects(links) with the following keys : 'href', 'text', 'file', to dir "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\interior2"`, () => {
    return mdLinks(
      "C:\\Users\\aliss\\Desktop\\Proyectos-laboratoria\\prueba\\interior2"
    ).then((result) => {
      expect(result).toEqual(
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
