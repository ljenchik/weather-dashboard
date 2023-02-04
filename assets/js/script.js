let cities = [];
let searchButton = $("#search-button");
let listOfCities = $(".input-group-append");
let inputEl = $("#search-input");
let currentWeatherEl = $("#today");
let forecastEl = $("#forecast");

let cityName;

searchButton.on("click", function(event) {
  event.preventDefault();

  let city = inputEl.val().trim();
  if (city && !cities.includes(city)) {
    cities.push(city);
    let cityButton = $("<button>")
      .text(city)
      .addClass("city-button my-2 btn btn-secondary")
      .attr("id", "cityButton");
    listOfCities.append(cityButton);
    cityName = city;
    inputEl.val("");
    currentWeatherEl.empty();
    forecastEl.empty();
  }
  else {
    alert("Please, enter city");
  }

  $.ajax({
    url: buildLocationQueryURL(city),
    method: "GET",
  }).then(function(response) {
    let lat = response[0].lat;
    let lon = response[0].lon;
    buildWeathertQueryURL(lat, lon);

    $.ajax({
      url: buildWeathertQueryURL(lat, lon),
      method: "GET",
    }).then(function(response) {
      console.log(response);

      currentWeatherEl.addClass('today');
      
      let cityNameEl = $("<h3>").addClass('city-name').text(`${cityName}, `);
      let currentDate = moment();

      let dateEl = $("<p>").text(currentDate.format("LL"));
      let iconEl = $("<img>").attr('src', `http://openweathermap.org/img/w/${response.weather[0].icon}.png`);
      
      currentWeatherEl.append(cityNameEl);
      currentWeatherEl.append(dateEl);
      currentWeatherEl.append(iconEl);

      currentWeatherEl.append($("<div>").text("Tempreture: " + Math.round(response.main.temp) + "ºC"));
      currentWeatherEl.append($("<div>").text("Wind: " + (response.wind.speed).toFixed(1) + " m/s"));
      currentWeatherEl.append($("<div>").text("Humidity: " + response.main.humidity + "%"));

      let forecastTitleEl = $("<h3>").text("5-Day Forecast");
      forecastEl.append(forecastTitleEl).addClass('forecast')

      let citiesArray = response.list;
      console.log("citiesArray", citiesArray);

      for (let i = 1; i < 6; i++) {
        let day = citiesArray.filter(item => splitOnDays(item, i))
        console.log(day);
        console.log('*************************');
        //day.forEach(element => )
      }
    });
  });
});







function buildLocationQueryURL(city) {
  let locationQueryURL = "http://api.openweathermap.org/geo/1.0/direct?";
  let locationQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  locationQueryParams.q = city;
  return locationQueryURL + $.param(locationQueryParams);
}

function buildWeathertQueryURL(lat, lon) {
  let weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?";
  let weatherQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  weatherQueryParams.lat = lat;
  weatherQueryParams.lon = lon;
  weatherQueryParams.units = "metric";
  return weatherQueryURL + $.param(weatherQueryParams);
}

// function splitOnDays(item, i) {
//   if 
//   return (moment.unix(item.dt).format("DD/MM/YYYY") === (moment(new Date()).add(`${i}`, 'days')).format("DD/MM/YYYY"))
// }




