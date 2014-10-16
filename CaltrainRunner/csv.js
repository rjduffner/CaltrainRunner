var csv = require("fast-csv");

var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
var formattedDate = month + "/" + day + "/" + year;
var currentCaltrainServiceType;

        
function getCaltrainServiceType(currentDate, callback){
    weekday = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')
    dayOfWeek = weekday[currentDate.getDay()]
    csv
     .fromPath("data/caltrain/calendar.txt", {headers: true, discardUnmappedColumns: true})
     .on("data", function(data){
         if (data[dayOfWeek] === '1'){
            serviceType = data.service_id
         }
     })
     .on("end", function(){
        callback(serviceType);
     });
}

getCaltrainServiceType(currentDate, function(data){ currentCaltrainServiceType = data;});
console.log(currentCaltrainServiceType)

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
