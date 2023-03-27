const csv = require("csv-parser");
const fs = require("fs");

function numberOfTimesTeamWonMatchToss() {
  const results = [];

  const outputFilePath =
    (__dirname,
    "./src/public/output/5-number-of-times-each-team-won-the-toss-also-won-the-match.json");
  const inputDataFilePath = (__dirname, "./src/data/matches.csv");

  fs.createReadStream(inputDataFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      //  console.log(results);

      let numTimesMatchAndToss = results.reduce((accumulator, current) => {
        if (current.toss_winner === current.winner) {
          if (accumulator[current.winner]) {
            accumulator[current.winner] += 1;
          } else {
            accumulator[current.winner] = 1;
          }
        }
        return accumulator;
      }, {});
      //  console.log(numTimesMatchAndToss);
      //--------------------------------------------------------
      let matchAndToss = {};
      let numTimesMatchAndToss1 = results.map((element) => {
        let toss = element.toss_winner;
        let match = element.winner;
        if (toss == match) {
          if (matchAndToss[match]) {
            matchAndToss[match] += 1;
          } else {
            matchAndToss[match] = 1;
          }
        }
      });
      //  console.log(matchAndToss);

      //----------------------------------------------------------------------

      fs.writeFile(
        outputFilePath,
        JSON.stringify(numTimesMatchAndToss),
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

numberOfTimesTeamWonMatchToss();
