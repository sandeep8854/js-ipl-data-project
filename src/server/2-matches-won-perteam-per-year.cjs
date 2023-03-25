const csv = require("csv-parser");
const fs = require("fs");

function matchesWonPerTeamPerYear() {
  const results = [];

  const outputFilePath =
    (__dirname, "./src/public/output/2-matches-won-per-team-per-year.json");
  const inputDataFilePath = (__dirname, "./src/data/matches.csv");

  fs.createReadStream(inputDataFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      //   let allMatches = {};
      let matchesWonPerTeamYear = results.reduce(
        (accumulator, current, index, array) => {
          if (accumulator.hasOwnProperty(current.season)) {
            if (accumulator[current.season].hasOwnProperty(current.winner)) {
              accumulator[current.season][current.winner]++;
            } else {
              accumulator[current.season][current.winner] = 1;
            }
          } else {
            accumulator[current.season] = {};
          }
          return accumulator;
        },
        {}
      );
      // console.log(matchesWonPerTeamYear);

      fs.writeFile(
        outputFilePath,
        JSON.stringify(matchesWonPerTeamYear),
        (error) => {
          if (error) {
            throw error;
          } else {
            console.log("File written successfully");
          }
        }
      );
    });
}

matchesWonPerTeamPerYear();
