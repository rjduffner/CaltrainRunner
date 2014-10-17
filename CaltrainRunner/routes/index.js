/*
 * GET home page.
 */

var csv = require("fast-csv");

exports.index = function(req, res){
    res.render('index', { title: 'Caltrain Runner' , tweets:req.app.get('tweets')})
};

exports.get_departures = function(req, res){
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var formattedDate = month + "/" + day + "/" + year;

    function getUpcomingCaltrainTrips(currentDate, stationIDNB, stationIDSB) {
        getCaltrainServiceType(currentDate, stationIDNB, stationIDSB, getFutureTrips);
    }

    function getCaltrainServiceType(currentDate, stationIDNB, stationIDSB, callback){
        weekday = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')
        // dayOfWeek = weekday[currentDate.getDay()]
        dayOfWeek = weekday[3]
        csv
            .fromPath("data/caltrain/calendar.txt", {headers: true, discardUnmappedColumns: true})
            .on("data", function(data){
                if (data[dayOfWeek] === '1'){
                    serviceType = data.service_id
                }
            })
            .on("end", function(){
                callback(serviceType, stationIDNB, stationIDSB, getRouteID);
            });
    }


    function getFutureTrips(serviceType, stationIDNB, stationIDSB, callback_2) {
        console.log(serviceType);
        var serviceIDPattern = '^[0-9]*-'
        var re = new RegExp(serviceIDPattern);
        var tripListNB = [];
        var tripListSB = [];
        csv
            .fromPath("data/caltrain/stop_times.txt", {headers: true, discardUnmappedColumns: true})
            .on("data", function(data){
                var parsed_trip_id = data.trip_id.split(re)[1];
                if (inFuture(data.arrival_time)){
                    if (data.stop_id === stationIDNB && parsed_trip_id === serviceType){
                        tripListNB.push(data);
                    }
                    else if (data.stop_id === stationIDSB && parsed_trip_id === serviceType){
                        tripListSB.push(data);
                    }
                }
            })
            .on("end", function(){
                console.log(tripListNB)
                console.log(tripListNB.length)

                console.log(tripListSB)
                console.log(tripListSB.length)

                for (var i = 0; i < tripListNB.length; i++) {
                    tripListNB[i]["direction"] = 'Northbound';
                };

                for (var i = 0; i < tripListSB.length; i++) {
                    tripListSB[i]["direction"] = 'Southbound';
                };

                callback_2(tripListNB.slice(0,5), tripListSB.slice(0,5))
                console.log("done");
            });
    }

    function getRouteID(tripsNB, tripsSB){
        all_trips = tripsNB.concat(tripsSB);

        csv
            .fromPath("data/caltrain/trips.txt", {headers:true, discardUnmappedColumns: true})
            .on("data", function(data){
                for (var i = 0; i < all_trips.length; i++) {
                    if (all_trips[i]["trip_id"] === data.trip_id){
                        all_trips[i]["service_type"] = getServiceType(data.route_id);
                        all_trips[i]["trip_head_sign"] = data.trip_headsign;
                        delete all_trips[i]["departure_time"];
                        delete all_trips[i]["stop_id"];
                        delete all_trips[i]["pickup_type"];
                        delete all_trips[i]["drop_off_type"];
                        delete all_trips[i]["stop_sequence"];
                    }
                };

            })
            .on("end", function(){
                var response = generateResponse(tripsNB, tripsSB);
                res.send(response);
            });
    }

    function inFuture(trip_time){
        // currentTime = new Date().toLocaleTimeString()
        currentTime = '10:45:56';
        if (currentTime < trip_time) {
            return true;
        }
        else {
            return false;
        }
    }

    function getServiceType(serviceType) {
        serviceAbbr = serviceType.split('-')[0].toLowerCase();

        switch(serviceAbbr) {
            case 'li':
                serviceType = 'Limited';
                break;
            case 'lo':
                serviceType = 'Local';
                break;
            case 'bu':
                serviceType = 'Bullet';
                break;
            default:
                serviceType = 'Local';
        }

        return serviceType;
    }

    function generateResponse(tripsNB, tripsSB){
        var response = JSON.parse('{"northbound" : [], "southbound": []}')
        sortedNBTrips = sortByKey(tripsNB, 'arrival_time');
        sortedSBTrips = sortByKey(tripsSB, 'arrival_time');

        response.northbound = sortedNBTrips;
        response.southbound = sortedSBTrips;
        return response
    }

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }


    getUpcomingCaltrainTrips(currentDate, '70171', '70172');
}
