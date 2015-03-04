/*
 * GET home page.
 */

var csv = require("fast-csv");

exports.index = function(req, res){
    res.render('layout', { title: 'Caltrain Runner' })
};

exports.get_departures = function(req, res){
    var currentDate = new Date();

    function getUpcomingCaltrainTrips(currentDate, stationIDNB, stationIDSB) {
        getCaltrainServiceType(currentDate, stationIDNB, stationIDSB, getFutureTrips);
    }

    function getCaltrainServiceType(currentDate, stationIDNB, stationIDSB, callback){
        weekday = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')
        dayOfWeek = weekday[currentDate.getDay()];
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
                for (var i = 0; i < tripListNB.length; i++) {
                    tripListNB[i]["direction"] = 'North';
                };

                for (var i = 0; i < tripListSB.length; i++) {
                    tripListSB[i]["direction"] = 'South';
                };

                var sortedNBTrips = generateResponse(tripListNB);
                var sortedSBTrips = generateResponse(tripListSB);

                callback_2(sortedNBTrips.slice(0,5), sortedSBTrips.slice(0,5))
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
                        all_trips[i]["train_number"] = data.trip_short_name;
                        delete all_trips[i]["departure_time"];
                        delete all_trips[i]["stop_id"];
                        delete all_trips[i]["pickup_type"];
                        delete all_trips[i]["drop_off_type"];
                        delete all_trips[i]["stop_sequence"];
                    }
                };

            })
            .on("end", function(){
                var response = generateResponse(all_trips);
                res.send(response);
            });
    }

    function inFuture(trip_time){
        currentTime = new Date().toLocaleTimeString();
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
    getUpcomingCaltrainTrips(currentDate, '70171', '70172');
}

exports.get_games = function(req, res){
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();

    var currentDateStr = month.toString() + '/' + day.toString() + '/' + year.toString();
    var games_today = [];
    csv
        .fromPath("data/sharks20142015.csv", {headers: true, discardUnmappedColumns: true})
        .on("data", function(data) {
            if (currentDateStr === data.START_DATE) {
                games_today.push(data);
            }
        })
        .on("end", function() {
            games_today = generateResponse(games_today, 'START_TIME');
            res.send(games_today);
        });
}

function generateResponse(trips){
    var response = sortByKey(trips, 'arrival_time');
    return response
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
