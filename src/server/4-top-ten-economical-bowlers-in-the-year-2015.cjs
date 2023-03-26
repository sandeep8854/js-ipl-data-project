const csv = require("csv-parser");
const fs = require("fs");

function topEconomicalBowlers() {
  let matchData = [];
  let deliverieData = [];

  const outputFilePath =
    (__dirname,
    "./src/public/output/4-top-ten-economical-bowlers-in-the-year-2015.json");

  const inputDataMatchesPath = (__dirname, "./src/data/matches.csv");
  const inputDeliveriesFilePath = (__dirname, "./src/data/deliveries.csv");

  fs.createReadStream(inputDataMatchesPath)
    .pipe(csv())
    .on("data", (data) => matchData.push(data))
    .on("end", () => {
      //-----------------------------------------------------------------
      //   let matchObj = [];
      //   for (let x in matchData) {
      //     if (matchData[x].season == 2017) matchObj.push(matchData[x]);
      //   }
      //   //   console.log(matchObj.length);
      //   let idFromObj = [];
      //   for (let xy in matchObj) {
      //     idFromObj.push(matchObj[xy].id);
      //   }
      //  console.log(idFromObj);
      //-----------------------------------------------------------------------------
      //------------------------------------------------------------
      //  console.log(matchData); // all match data is here.
      let year2015 = matchData.filter(function (ele) {
        return ele.season == 2015;
      });
      //  console.log(year2015);

      let storeID = year2015.map(function (ele) {
        return ele.id;
      });
      //   console.log(storeID); //for checking
      //---------------------------------------------------------------------------
      fs.createReadStream(inputDeliveriesFilePath)
        .pipe(csv())
        .on("data", (data) => deliverieData.push(data))
        .on("end", () => {
          //-----------------------------------------------------------
          //   let temp = {};
          //   for (let x in deliverieData) {
          //     //  console.log(deliverieData[x].match_id);
          //     if (idFromObj.includes(deliverieData[x].match_id)) {
          //       if (temp[deliverieData[x].bowler]) {
          //         temp[deliverieData[x].bowler] += Number(
          //           deliverieData[x].total_runs
          //         );
          //       } else {
          //         temp[deliverieData[x].bowler] = Number(
          //           deliverieData[x].total_runs
          //         );
          //       }
          //     }
          //   }
          //   console.log(temp);
          //--------------------------------------------------------------

          //   console.log(deliverieData); // all deliveries data is here..
          let bowlersRun = deliverieData.reduce(function (acc, curr) {
            if (storeID.includes(curr.match_id)) {
              if (acc[curr.bowler]) {
                acc[curr.bowler] = acc[curr.bowler] + Number(curr.total_runs);
              } else {
                acc[curr.bowler] = Number(curr.total_runs);
              }
            }
            return acc;
          }, {});
          //   console.log(bowlersRun);
          //console.log(typeof bowlersRun);
          //console.log(Object.keys(bowlersRun).length); // find the length of objects.
          //-----------------------------------------------------------------------------
          // find out, bowlers balls
          const bowlersBalls = deliverieData.reduce((acc, curr) => {
            if (storeID.includes(curr.match_id)) {
              if (acc[curr.bowler]) {
                if (curr.wide_runs == 0 && curr.noball_runs == 0) {
                  acc[curr.bowler] = acc[curr.bowler] + 1;
                } else {
                  acc[curr.bowler] = acc[curr.bowler] + 0;
                }
              } else {
                if (curr.wide_runs == 0 && curr.noball_runs == 0) {
                  acc[curr.bowler] = 1;
                } else {
                  acc[curr.bowler] = 0;
                }
              }
            }
            return acc;
          }, {});
          //   console.log(bowlersBalls);
          //--------------------------------------------------------------------------
          const bowlerEconomy = deliverieData.reduce((acc, curr) => {
            if (storeID.includes(curr.match_id)) {
              acc[curr.bowler] = Number(
                (
                  bowlersRun[curr.bowler] /
                  (bowlersBalls[curr.bowler] / 6)
                ).toFixed(2)
              );
            }
            return acc;
          }, {});
          // console.log(bowlerEconomy);
          //-------------------------------------------------------------------

          let sortable = [];
          for (var key in bowlerEconomy) {
            sortable.push([key, bowlerEconomy[key]]);
          }
          //   console.log(sortable);
          sortable.sort(function (a, b) {
            return a[1] - b[1];
          });
          finalData = [];
          //  console.log(sortable.length);
          for (let i = 0; i < 10; i++) {
            finalData.push(sortable[i]);
          }
          //   console.log(finalData);
          let top10EconomicalBowler = Object.fromEntries(finalData);
          // console.log(top10EconomicalBowler);

          fs.writeFile(
            outputFilePath,
            JSON.stringify(top10EconomicalBowler),
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

topEconomicalBowlers();
