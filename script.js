var search_history = "";
$("#city-input").on("keyup", function(){
    $("#search-form button").prop("disabled", !$(this).val())
});
$("#search-form").on("submit", function(event){
event.preventDefault();
let input_city = $("#city-input").val();
searchCity(input_city);
});


function searchCity(city){
    console.log(city);
// add ajax requests
}

function displayCurrentWeather(weather_data){

}

function display5DayForecast(forecast_data) {

}

function displaySearchHistory(){

}

function saveSearchHistory(){
// will need to stringify search_history to bring into local storage
}

displaySearchHistory();