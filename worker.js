const { parentPort,threadId } = require('worker_threads');
const haversine = require('haversine-distance')


function Getresult(obj,Tid){
    var object=obj
    object[0]["distance_from_prev_point"]=null; ///initialization Of the first point
    object[0]["worker_id"]=Tid //thread Id

    for(var i=1;i<object.length;i++){
      const Current=object[i]
      Previous=object[i-1]
      dist=haversine({latitude:Previous['latitude'],longitude:Previous['longitude']},{latitude:Current['latitude'],longitude:Current['longitude']}) ///Calculating the distance in meters
      object[i]["distance_from_prev_point"]=dist===0 ? 0 : dist.toFixed(3);
      object[i]["worker_id"]=Tid
     
    }
    return object
}

parentPort.on('message', (param) => {

  const result = Getresult(param,threadId);
  console.log(`Using Thread Id : ${threadId}`)
  parentPort.postMessage(result);
  

});