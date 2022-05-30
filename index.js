

const express = require('express')
require('dotenv').config()
const { StaticPool } = require('node-worker-threads-pool')
const port = process.env.Port
const app = express()
const filePath = './worker.js'
const pool = new StaticPool({
    size: parseInt(process.env.PoolSize),
    task: filePath
  })


async function WorkerMision(SoftObject)
{
   
    return new Promise(async (resolve,reject)=>{
        
        try{
           let obj=[]
            for (const property in SoftObject) {
               
                let res= await pool.exec(SoftObject[property]);
                obj.push(...res)
            }
        resolve(obj)
        }
        catch(error){
            resolve(false)

        }
    })
}





app.get('/',async (req,res)=>{
    let obj=CsvObject()///Convert CsV File ==> to array
    let SoftObject=CreactObjectSoftArray(obj);
    let ans=await WorkerMision(SoftObject)
    res.send(ans)

});


function CsvObject(){
    var fs = require('fs');
    var data = fs.readFileSync('file.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim())); // split each line to array
return (data); 
}

function CreactObjectSoftArray(obj){

    let objarray=[]; ///{}
    for(let i=1; i<obj.length;i++){
        if( objarray[obj[i][1]] === undefined ) {
            objarray[obj[i][1]]=[]
        }
        objarray[obj[i][1]].push({
            [obj[0][0]]:obj[i][0],
            [obj[0][1]]:obj[i][1],
            [obj[0][2]]:obj[i][2],
            [obj[0][3]]:obj[i][3],

        })
    } 

    return objarray;
}



app.listen(port, () => {})