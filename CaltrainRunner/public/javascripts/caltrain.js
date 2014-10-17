var trainData = { northbound: [
	{   arrivalTime: "1500", 
        serviceType: "BB",
        tripHeadsign: 'HELLO WORLD',
        direction: "NORTH"
    },

	{   arrivalTime: "1630",
        serviceType: "LO",
        tripHeadsign: 'HELLO WORLD',
        direction: "NORTH"
    }],

    southbound: [
 	{   arrivalTime: "544", 
        serviceType: "LI",
        tripHeadsign: 'HELLO WORLD',
        direction: "South"
    },

	{   arrivalTime: "1615",
        serviceType: "GIL",
        tripHeadsign: 'HELLO WORLD',
        direction: "South"
    }]      
};

$.get( "/get_departures")
.done(function(data) {
    currentDate = new Date();
    for (item in data){
        var arrivalDate = new Date(item.arrival_time)
        var diff  =  new Date (arrivalDate.getTime() - currentDate.getTime());
        item.diff = diff.getMinutes()
    }

        

    var finalTrainData = {'departing' : data}
    var tpl = $('#table-template').html()
    var html = Mustache.to_html(tpl, finalTrainData);
    $('#train-data').html(html);


});







