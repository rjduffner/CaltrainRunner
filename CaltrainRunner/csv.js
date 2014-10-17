var csv = require("fast-csv");

var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
var formattedDate = month + "/" + day + "/" + year;

function getCaltrainNorthBound(currentDate, stationID) {
    getCaltrainServiceType(currentDate, stationID, getStopTimes);
}


function getCaltrainServiceType(currentDate, stationID, callback){
    weekday = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')
    dayOfWeek = weekday[currentDate.getDay()]
    var xxxxxx = csv
     .fromPath("data/caltrain/calendar.txt", {headers: true, discardUnmappedColumns: true})
     .on("data", function(data){
        if (data[dayOfWeek] === '1'){
            serviceType = data.service_id
        }
     })
     .on("end", function(){
        callback(serviceType, stationID);
     });
}


function getStopTimes(serviceType, stationID) {
    console.log(serviceType);
    var serviceIDPattern = '^[0-9]*-'
    var re = new RegExp(serviceIDPattern);
    csv
     .fromPath("data/caltrain/stop_times.txt", {headers: true, discardUnmappedColumns: true})
     .on("data", function(data){
        var parsed_trip_id = data.trip_id.split(re)[1];
         if (data.stop_id === stationID && parsed_trip_id === serviceType){
            console.log(data);
         }
     })
     .on("end", function(){
         console.log("done");
     });
}

getCaltrainNorthBound(currentDate, '70172');





/*
csv
 .fromPath("data/sharks20142015.csv", {headers: true, discardUnmappedColumns: true})
 .on("data", function(data){
     if (data.START_DATE === '04/06/2015'){
        console.log(data);
     }
 })
 .on("end", function(){
     console.log("done");
 });




csv
 .fromPath("data/caltrain/stop_times.txt", {headers: true, discardUnmappedColumns: true})
 .on("data", function(data){
     // NORTH BOUND
     if (data.stop_id === '70171'){
        console.log(data);
     }
 })
 .on("end", function(){
     console.log("done");
 });


csv
 .fromPath("data/caltrain/stop_times.txt", {headers: true, discardUnmappedColumns: true})
 .on("data", function(data){
     //SOUTH BOUND
     if (data.stop_id === '70172'){
        console.log(data);
     }
 })
 .on("end", function(){
     console.log("done");
 });
 */
