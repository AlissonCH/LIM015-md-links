#!/usr/bin/env node
require("colors");
const mdLinks = require("./mdLinks.js");

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
  }                  Must be a string, it can be file with extension '.md' or directory. 
  ${
    `[--validate]`.blue
  }              Http status for each link in markdown file.
  ${`[--stats]`.blue}                 General statistics of links.
  ${`[--stats]`.blue} ${`[--validate]`.blue}    Statistics of links with status.
  ${`[--validate]`.blue} ${`[--stats]`.blue}    Statistics of links with status.

  For example: 
      md-links ${"readme.md".blue} <path>
      md-links ${"readme.md".blue} <path> ${`--validate`.blue}
      md-links ${"C:\\A\\B\\readme.md".blue} <path> ${`--stats`.blue}
      md-links ${"C:\\A\\B\\".blue} <path> ${`--stats --validate`.blue}
  `;
  return message;
};

function options() {
  const secondArgument = process.argv[3];
  const thirdArgument = process.argv[4];
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
  process.stdout.write(`\n${"Total: ".blue} ${result["Total"]}\n`);
  process.stdout.write(`${"Unique: ".blue} ${result["Unique"]}\n`);
  process.stdout.write(
    `${
      result["Broken"] || result["Broken"] === 0
        ? `${"Broken".blue} ${result["Broken"]}`
        : ""
    }\n`
  );
};

function acum(result) {
  const acum = result.reduce(({ Total = 0, Unique = 0, Broken = 0 }, item) => {
    Total += item.Total;
    Unique += item.Unique;
    Broken += item.Broken;
    return { Total, Unique, Broken };
  }, {});
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
        process.stdout.write(`\n${item["file"]} `);
        process.stdout.write(`${item["href"]} `.blue);
        process.stdout.write(`${item["status"] ? item["status"] : ""} `.green);
        process.stdout.write(
          `${item["statusText"] ? item["statusText"] : ""} `.magenta
        );
        process.stdout.write(`${item["text"]}`);
      });
    }
  }
};
function cli() {
  const firstArgument = process.argv[2];
  if (firstArgument) {
    mdLinks(firstArgument, options())
      .then((result) => {
        if (!result) {
          process.stdout.write(usageMessage());
        } else {
          showResultsInCli(result);
        }
      })
      .catch((err) => console.error(err));
  } else {
    process.stdout.write(usageMessage());
  }
}
cli();
