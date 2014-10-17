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


function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var finalTrainData = {'departing' : sortByKey(trainData.northbound.concat(trainData.southbound), 'arrivalTime')}
var tpl = $('#table-template').html()
var html = Mustache.to_html(tpl, finalTrainData);
$('#train-data').html(html);
