const csv = require("csv-parser");
const fs = require("fs");

function extraRunConcededPerTeam() {
  const match = [];
  const deliveries = [];

  const outputFilePath =
    (__dirname,
    "./src/public/output/3-extra-runs-conceded-per-team-in-the-year-2016.json");
  const matchDataFilePath = (__dirname, "./src/data/matches.csv");
  const deliveriesDataPath = (__dirname, "./src/data/deliveries.csv");
  fs.createReadStream(matchDataFilePath)
    .pipe(csv())
    .on("data", (data) => match.push(data))
    .on("end", () => {
      const match2016 = match.filter((element, index, array) => {
        return element.season == 2016;
      });
      //  console.log(match2016);  find all 2016 season matches.

      let storeID = match2016.map((element, index, array) => {
        return element.id;
      });
      //  console.log(storeID); // return only ID of the year of 2016 matches

      fs.createReadStream(deliveriesDataPath)
        .pipe(csv())
        .on("data", (data) => deliveries.push(data))
        .on("end", () => {
          const extraRuns = deliveries.reduce((accumulator, current) => {
            if (storeID.includes(current.match_id)) {
              if (accumulator[current.bowling_team]) {
                accumulator[current.bowling_team] += Number(current.extra_runs);
              } else {
                accumulator[current.bowling_team] = Number(current.extra_runs);
              }
            }
            return accumulator;
          }, {});
          //   console.log(extraRuns);
          fs.writeFile(outputFilePath, JSON.stringify(extraRuns), (error) => {
            if (error) {
              throw error;
            } else {
              console.log("File written successfully");
            }
          });
        });
    });
}

extraRunConcededPerTeam();
