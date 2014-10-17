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
    
    
    var arrayLength = data.length;
    for (var i = 0; i < arrayLength; i++) { 
        var arrivalSplit = data[i].arrival_time.split(':');




        currentDate = new Date(); 
        var arrivalDate = new Date(currentDate.getFullYear(),
                                   currentDate.getMonth(),
                                   currentDate.getDate(),
                                   arrivalSplit[0],
                                   arrivalSplit[1],
                                   arrivalSplit[2]);




        var diff = arrivalDate - currentDate;
        var mm = Math.floor(diff / 1000 / 60);
        data[i].diff = mm;


    }

    var finalTrainData = {'departing' : data}
    var tpl = $('#table-template').html()
    var html = Mustache.to_html(tpl, finalTrainData);
    $('#train-data').html(html);


});







