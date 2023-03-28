const csv = require("csv-parser");
const fs = require("fs");

function strikeRateOfTheBatsman() {
  const match = [];
  const deliveries = [];

  const outputFilePath =
    (__dirname,
    "./src/public/output/7-strike-rate-of-batman-for-each-season.json");
  const matchDataFilePath = (__dirname, "./src/data/matches.csv");
  const deliveriesDataPath = (__dirname, "./src/data/deliveries.csv");
  fs.createReadStream(matchDataFilePath)
    .pipe(csv())
    .on("data", (data) => match.push(data))
    .on("end", () => {
      const seasonMatchedId = match.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id] = currentValue.season;
        return accumulator;
      }, {});
      //   console.log(seasonMatchedId);

      fs.createReadStream(deliveriesDataPath)
        .pipe(csv())
        .on("data", (data) => deliveries.push(data))
        .on("end", () => {
          let batmanTotalRunsAndTotalBalls = deliveries.reduce(
            (accumulator, current) => {
              let seasonList = seasonMatchedId[current.match_id];
              if (accumulator[current.batsman]) {
                if (accumulator[current.batsman].hasOwnProperty(seasonList)) {
                  accumulator[current.batsman][seasonList].totalRuns += Number(
                    current.batsman_runs
                  );
                  accumulator[current.batsman][seasonList].totalBalls += 1;
                } else {
                  accumulator[current.batsman][seasonList] = {};
                  accumulator[current.batsman][seasonList].totalRuns = Number(
                    current.batsman_runs
                  );
                  accumulator[current.batsman][seasonList].totalBalls = 1;
                }
              } else {
                accumulator[current.batsman] = {};
                accumulator[current.batsman][seasonList] = {};
                accumulator[current.batsman][seasonList].totalRuns = Number(
                  current.total_runs
                );
                accumulator[current.batsman][seasonList].totalBalls = 1;
              }
              return accumulator;
            },
            {}
          );
          //     console.log(batmanTotalRunsAndTotalBalls);

          let batmanStrikeRate = {};
          Object.keys(batmanTotalRunsAndTotalBalls).map((element) => {
            // name of player
            let strikeRate = {};
            Object.keys(batmanTotalRunsAndTotalBalls[element]).map(
              (element2) => {
                let calculationOfStrikeRate = (
                  (batmanTotalRunsAndTotalBalls[element][element2].totalRuns /
                    batmanTotalRunsAndTotalBalls[element][element2]
                      .totalBalls) *
                  100
                ).toFixed(2);
                strikeRate[element2] = Number(calculationOfStrikeRate);
              }
            );
            batmanStrikeRate[element] = strikeRate;
          });
          //    console.log(batmanStrikeRate);

          fs.writeFile(
            outputFilePath,
            JSON.stringify(batmanStrikeRate),
            (error) => {
              if (error) {
                throw error;
              } else {
                console.log("File written successfully");
              }
            }
          );
        });
    });
}

strikeRateOfTheBatsman();
