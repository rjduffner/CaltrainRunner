$.simpleWeather({
location: 'Palo Alto, CA',
woeid: '',
unit: 'f',
success: function(weather) {
    var tpl = $('#weather-template').html()
    var html = Mustache.to_html(tpl, weather);
    $('#weather').html(html);
},
error: function(error) {
  $("#weather").html('<p>'+error+'</p>');
}
});



