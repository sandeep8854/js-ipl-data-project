const csv = require("csv-parser");
const fs = require("fs");

function matchesPerYear() {
  const results = [];

  const outputFilePath =
    (__dirname, "./src/public/output/1-matches-per-year.json");
  const inputDataFilePath = (__dirname, "./src/data/matches.csv");

  fs.createReadStream(inputDataFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      let findFrequency = results.reduce(
        (accumulator, current, index, array) => {
          if (accumulator[current.season]) {
            accumulator[current.season]++;
          } else {
            accumulator[current.season] = 1;
          }
          return accumulator;
        },
        {}
      );
      //   console.log(findFrequency);
      fs.writeFile(outputFilePath, JSON.stringify(findFrequency), (error) => {
        if (error) {
          throw error;
        } else {
          console.log("File written successfully");
        }
      });
    });
}

matchesPerYear();
