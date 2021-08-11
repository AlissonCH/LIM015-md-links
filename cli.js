#!/usr/bin/alissoncruz-md-links
require("colors");
const mdLinks = require("./mdLinks");

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
    `[<path>]`.blue
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
    } else if (secondArgument == "--validate" && thirdArgument == "--stats") {
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
    // result is not an array
    return showStatsInCli(result);
  } else {
    //result is an array
    if (result[0]["Total"]) {
      return showStatsInCli(acum(result));
    } else if (result[0] === false) {
      return console.log(usageMessage());
    } else {
      return result.forEach((item) => {
        console.log(
          `${item["file"]}`,
          `${item["href"]}`.blue,
          `${item["status"] ? item["status"] : ""}`.green,
          `${item["statusText"] ? item["statusText"] : ""}`.magenta,
          `${item["text"]}`
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
    return console.log(usageMessage());
  }
}

cli();
