const csv = require("csv-parser");
const fs = require("fs");

function heigestNumberOfTimeHasBeebDDismissed() {
  const deliveries = [];

  const outputFilePath =
    (__dirname,
    "./src/public/output/8-heigest-number-of-times-one-player-has-been-dismissed-by-another.json");

  const deliveriesDataPath = (__dirname, "./src/data/deliveries.csv");

  fs.createReadStream(deliveriesDataPath)
    .pipe(csv())
    .on("data", (data) => deliveries.push(data))
    .on("end", () => {
      //   console.log(deliveries);
      const listOfDismissedPlayer = deliveries.reduce(
        (accumulator, currentValue) => {
          if (currentValue.player_dismissed) {
            if (accumulator[currentValue.bowler]) {
              if (
                accumulator[currentValue.bowler].hasOwnProperty(
                  currentValue.batsman
                )
              ) {
                accumulator[currentValue.bowler][currentValue.batsman] += 1;
              } else {
                accumulator[currentValue.bowler][currentValue.batsman] = 1;
              }
            } else {
              accumulator[currentValue.bowler] = {};
            }
          }
          return accumulator;
        },
        {}
      );
      //  console.log(listOfDismissedPlayer);

      const bowlerArrayConvert = Object.entries(listOfDismissedPlayer);
      //   console.log(bowlerArrayConvert.length);

      const bowlerDismissedArraySort = bowlerArrayConvert.reduce(
        (accumulator, current) => {
          const sortedPlayers = Object.entries(current[1]).sort(
            (start, end) => end[1] - start[1]
          );
          accumulator[current[0]] = sortedPlayers[0];
          return accumulator;
        },
        {}
      );
      //    console.log(bowlerDismissedArraySort);
      let newArr = [];
      let arr = Object.entries(bowlerDismissedArraySort);
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][1] != undefined) {
          newArr.push(arr[i]);
        }
      }
      //   console.log(newArr);
      const sortedArray = newArr.sort((a, b) => b[1][1] - a[1][1]);
      //  console.log(sortedArray[0]);
      //---------------------------------------------------------
      //   const myArray = ["Z Khan", ["MS Dhoni", 7]];

      //   const myObject = {
      //     [myArray[0]]: { [myArray[1][0]]: myArray[1][1] },
      //   };

      //   console.log(myObject);

      //------------------------------------------------------------

      fs.writeFile(outputFilePath, JSON.stringify(sortedArray[0]), (error) => {
        if (error) {
          throw error;
        } else {
          console.log("File written successfully");
        }
      });
    });
}

heigestNumberOfTimeHasBeebDDismissed();
