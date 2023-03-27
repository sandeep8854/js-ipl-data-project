const csv = require("csv-parser");
const fs = require("fs");

function numberOfTimesTeamWonMatchToss() {
  const results = [];

  const outputFilePath =
    (__dirname,
    "./src/public/output/6-find-player-who-has-heigest-number-of-player-of-the-match.json");
  const inputDataFilePath = (__dirname, "./src/data/matches.csv");

  fs.createReadStream(inputDataFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      let playerOfTheMatch = results.reduce((accumulator, current) => {
        if (accumulator[current.season]) {
          if (accumulator[current.season][current.player_of_match]) {
            accumulator[current.season][current.player_of_match] += 1;
          } else {
            accumulator[current.season][current.player_of_match] = 1;
          }
        } else {
          accumulator[current.season] = {};
          accumulator[current.season][current.player_of_match] = 1;
        }
        return accumulator;
      }, {});

      // console.log(playerOfTheMatch);
      let listOfThePlayerOfTheMatch = Object.entries(playerOfTheMatch).reduce(
        (acc, curr) => {
          let perOfYear = Object.fromEntries(
            Object.entries(curr[1])
              .sort((first, second) => second[1] - first[1])
              .slice(0, 1)
          );
          //  console.log(perOfYear);
          acc[curr[0]] = perOfYear;
          return acc;
        },
        {}
      );
      console.log(listOfThePlayerOfTheMatch);
      // console.log(listOfThePlayerOfTheMatch.length);

      //---------------------------------------------------------------------
      /*
      //  console.log(playerOfTheMatch);
      let obj = {};
      let answer1 = [];
      let answer2 = [];
      for (let year in playerOfTheMatch) {
        let temp = 0;
        let name;
        for (let val in playerOfTheMatch[year]) {
          if (playerOfTheMatch[year][val] > temp) {
            temp = playerOfTheMatch[year][val];
            name = val;
          }
        }
        answer1.push(name);
        answer2.push(temp);
        temp = 0;
        name = "";
      }
      //  console.log(answer1);
      //  console.log(answer2);
      let yearA = results.map((ele) => {
        return ele.season;
      });
      let yearB = [...new Set(yearA)];

      // console.log(yearB);

      let makingObj1 = {};
      for (let index = 0; index < answer1.length; index++) {
        makingObj1[answer1[index]] = answer2[index];
      }
      //   console.log(makingObj1);

      let newObject = {};
      let index = 0;
      for (let key in makingObj1) {
        if (!newObject.hasOwnProperty([key]))
          newObject[yearB[index]] = { [key]: makingObj1[key] };
        index++;
      }
      //   console.log(newObject);
*/
      //-----------------------------------------------------------------------
      //   fs.writeFile(outputFilePath, JSON.stringify(newObject), (error) => {
      //     if (error) {
      //       throw error;
      //     } else {
      //       console.log("File written successfully");
      //     }
      //   });
    });
}

numberOfTimesTeamWonMatchToss();
