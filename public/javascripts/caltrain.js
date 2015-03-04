function get_departures() {
    $.get( "/caltrainrunner/get_departures")
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
            if (mm < 6){
                data[i].soon='soon';
            }


        }

        var finalTrainData = {'departing' : data}
        var tpl = $('#table-template').html()
        var html = Mustache.to_html(tpl, finalTrainData);
        $('#train-data').html(html);
    });

    setTimeout('get_departures()', 30000);
}

get_departures();
