var appid = "5bd04b832c98f0f10b5f6747785f4482";
let retrArr = JSON.parse(localStorage.getItem("city")) || "null";
var search_history = [];
let today = moment();
let storedCity = localStorage.getItem("storedCity");
let humid = $("#currentHumid").text("%");
let wind = $("#currentWind").text(" MPH");
let uvIndex = $("#currentUV").text("test uv");

function fiveDayForecast(forecast) {
  let listArr = forecast.list;
  let i = 5;
  while (i < listArr.length) {
    let newForecast = listArr[i];
    i += 8;
    let icon = newForecast.weather[0].icon;
    let src = `https://openweathermap.org/img/wn/${icon}.png`;
    let cardCol = $('<div class="col-md-2 card pl-1 bg-primary">');
    let cardBody = $('<div class="card-body p-0">');
    let h5El = $("<h5>").text(moment(newForecast.dt_txt).format("L"));
    let imgEl = $("<img>").attr("src", src);
    let p1El = $("<p>").html(
      `Temp: ${convertKtoF(parseFloat(newForecast.main.temp)).toFixed(2)}&deg;F`
    );
    let p2El = $("<p>").text(`Humidity: ${newForecast.main.humidity}%`);
    cardBody.append(h5El);
    cardBody.append(imgEl);
    cardBody.append(p1El);
    cardBody.append(p2El);
    cardCol.append(cardBody);
    $(".card-deck").append(cardCol);
  }
  $("#5d-forecast").removeClass("d-none");
}

function updateCurrentCity(location) {
  console.log(location);
  let city = location.name;
  $("#searchedName").text(city + " (" + new Date().toLocaleDateString() + ")");
  let temp = (location.main.temp * 1.8 - 459.6).toString();
  const res = Number(temp.slice(0, 4));
  $("#currentTemp").text(res + " °F");
  $("#currentHumid").text(location.main.humidity + "%");
  $("#currentWind").text(location.wind.speed + " MPH");
  let latitude = location.coord.lat;
  let longitude = location.coord.lon;
  let uvEndpoint = `https://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${latitude}&lon=${longitude}`;

  $.ajax({
    url: uvEndpoint,
    method: "GET",
  }).then((res) => {
    if (res.value > 8) {
      $("#currentUV").addClass("btn-danger").text(res.value);
      $("#currentUV").removeClass("btn-warning").text(res.value);
      $("#currentUV").removeClass("btn-success").text(res.value);
    } else if (res.value <= 8 && res.value > 3) {
      $("#currentUV").addClass("btn-warning").text(res.value);
      $("#currentUV").removeClass("btn-danger").text(res.value);
      $("#currentUV").removeClass("btn-success").text(res.value);
    } else {
      $("#currentUV").addClass("btn-success").text(res.value);
      $("#currentUV").removeClass("btn-danger").text(res.value);
      $("#currentUV").removeClass("btn-warning").text(res.value);
    }
  });

  localStorage.setItem("storedCity", city);
  storedCity = localStorage.getItem("storedCity");

  let cityArray = JSON.parse(localStorage.getItem("city"));
  if (!cityArray) {
    cityArray = [];
    cityArray.push(city);
    localStorage.setItem("city", JSON.stringify(cityArray));
  } else {
    if (cityArray.indexOf(city) === -1) {
      cityArray.push(city);
      localStorage.setItem("city", JSON.stringify(cityArray));
    }
  }

  retrArr = JSON.parse(localStorage.getItem("city"));
  let icon = location.weather[0].icon;
  $("#city-history").empty();
  for (let i = 0; i < retrArr.length; i++) {
    let liEl = $(`<li class='list-group-item'>`);
    liEl.text(retrArr[i]);
    $("#city-history").prepend(liEl);
  }
}

function convertKtoF(tempInKelvin) {
  return ((tempInKelvin - 273.15) * 9) / 5 + 32;
}

function searchCity(city) {
  let currentEndpoint = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${city}`;
  let forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${city}`;
  $.ajax({
    url: currentEndpoint,
    method: "GET",
  }).then(updateCurrentCity);

  $.ajax({
    url: forecastEndpoint,
    method: "GET",
  }).then(fiveDayForecast);
}

if (storedCity) {
  searchCity(storedCity);
}

// On Clicks

$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  let input_city = $("#city-name").val().trim();
  console.log(input_city);
  $("#city-history").empty();
  $("#forecastCard").empty();
  if (input_city === "") {
    alert("please enter a city.");
    return;
  }
  if (isNaN(input_city) === false) {
    alert("city name cannot be an integer");
    return;
  }
  searchCity(input_city);
});

$(document).on("click", ".list-group-item", function (event) {
  event.preventDefault();
  $("#forecastCard").empty();
  let clickedCity = $(this).text();
  localStorage.setItem("storedCity", clickedCity);
  storedCity = localStorage.getItem("storedCity");
  searchCity(clickedCity);
});
