const express = require('express')
require('dotenv').config()///Program settings
const { StaticPool } = require('node-worker-threads-pool')
const fs = require('fs');
const port = process.env.Port
const app = express()
const filePath = './worker.js'
const csv=require('csvtojson')
const converter = require('json-2-csv');
const csvFilePath=process.env.FilePath
const pool = new StaticPool({
    size: parseInt(process.env.PoolSize),///Number of pool Workers
    task: filePath //// Worker Task
  })

async function WorkerMission(arrayTofiil)
{
  const jsonArray=await csv().fromFile(csvFilePath);/// Convert CSV FILE => TO JSON 
 var SoftObject=groupBy(jsonArray, 'vehicle_id')/// Group by vehicle_id

  return await new Promise(async (resolve, rejects) => {
    const PromiseArray = [];
    /// Run on the grouped array by vehicle_id => send evrytime one object to the worker
    for (const property in SoftObject) {

      const PromiseVal = new Promise(async (resolve, reject) => {
          pool.exec(SoftObject[property]).then((data) => {
            arrayTofiil.push(...data);
            resolve();
          }).catch((error) => reject(error));
      });
      PromiseArray.push(PromiseVal);
    }

    resolve(await Promise.all(PromiseArray));
  });
}

var groupBy = function(xs, key) {//Sorting array by key
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

app.get('/',async (req,res)=>{
        var FillObject=[];
        var obj=await WorkerMission(FillObject)
        FillObject=FillObject.sort((a, b) => parseInt(a.row_id) - parseInt(b.row_id)); ///Sort The array By  row_id => ASC

      converter.json2csv(FillObject, (err, csv) => {
          if (err) {
              throw err;
          }
          // write CSV to a file
          fs.writeFileSync(process.env.CompleteTaskPath, csv);
          
      });
         res.send("Done!")   
  });
  
app.listen(port, () => {})