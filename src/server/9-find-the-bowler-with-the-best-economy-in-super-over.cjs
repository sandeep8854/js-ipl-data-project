const csv = require("csv-parser");
const fs = require("fs");

function heigestNumberOfTimeHasBeebDDismissed() {
  const deliveries = [];

  const outputFilePath =
    (__dirname,
    "./src/public/output/9-find-the-bowler-with-the-best-economy-in-super-over.json");

  const deliveriesDataPath = (__dirname, "./src/data/deliveries.csv");

  fs.createReadStream(deliveriesDataPath)
    .pipe(csv())
    .on("data", (data) => deliveries.push(data))
    .on("end", () => {
      //console.log(deliveries);
      let superOverArray = deliveries
        .filter((element) => {
          return element.is_super_over == "1";
        })
        .reduce((accumulator, current, index, array) => {
          if (current.wide_runs == "0" && current.noball_runs == "0") {
            if (accumulator[current.bowler]) {
              accumulator[current.bowler][0] += Number(current.batsman_runs);
              accumulator[current.bowler][1] += 1; //ball
            } else {
              accumulator[current.bowler] = [Number(current.batsman_runs), 1];
            }
          } else {
            if (accumulator[current.bowler]) {
              accumulator[current.bowler[0]] = Number(current.total_runs) + 1;
            } else {
              accumulator[current.bowler] = [Number(current.total_runs), 0];
            }
          }
          return accumulator;
        }, {});
      //   console.log(superOverArray);

      const bowlerEconomy = Object.entries(superOverArray);
      //   console.log(bowlerEconomy);
      let TadakaArray = [];
      for (let i = 0; i < bowlerEconomy.length; i++) {
        if (bowlerEconomy[i][1].length == 2) {
          TadakaArray.push(bowlerEconomy[i]);
        }
      }
      //    console.log(TadakaArray);
      const playerStats = {};

      for (let i = 0; i < TadakaArray.length; i++) {
        const name = TadakaArray[i][0];
        let digits = Math.round(
          TadakaArray[i][1][0] / (TadakaArray[i][1][1] / 6)
        );

        playerStats[name] = digits;
      }

      // console.log(playerStats);

      const sortedPlayerStats = Object.fromEntries(
        Object.entries(playerStats).sort(
          ([, valueA], [, valueB]) => valueA - valueB
        )
      );
      //  let clone = { ...sortedPlayerStats };
      let fromE = Object.entries(sortedPlayerStats);
      //    console.log(fromE[0]);

      fs.writeFile(outputFilePath, JSON.stringify(fromE[0]), (error) => {
        if (error) {
          throw error;
        } else {
          console.log("File written successfully");
        }
      });
    });
}

heigestNumberOfTimeHasBeebDDismissed();
