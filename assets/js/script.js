let cities = [];
let searchButton = $("#search-button");
let listOfCities = $(".input-group-append");
let inputEl = $("#search-input");
let currentWeatherEl = $("#today");
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
  }

  $.ajax({
    url: buildLocationQueryURL(city),
    method: "GET",
  }).then(function(response) {
    let lat = response[0].lat;
    let lon = response[0].lon;
    buildForecastQueryURL(lat, lon);

    $.ajax({
      url: buildForecastQueryURL(lat, lon),
      method: "GET",
    }).then(function(response) {
      console.log(response);
      
      let iconEl = $("<img>").attr('src', `http://openweathermap.org/img/w/${response.list[0].weather[0].icon}.png`);
      
      currentWeatherEl.append(cityName + ",  ");
      currentWeatherEl.append(moment().format("LL"));
      currentWeatherEl.append(iconEl);
    });
  });
});







function buildLocationQueryURL(city) {
  let locationQueryURL = "http://api.openweathermap.org/geo/1.0/direct?";
  let locationQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  locationQueryParams.q = city;
  return locationQueryURL + $.param(locationQueryParams);
}
function buildForecastQueryURL(lat, lon) {
  let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?";
  let forecastQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  forecastQueryParams.lat = lat;
  forecastQueryParams.lon = lon;
  return forecastQueryURL + $.param(forecastQueryParams);
}
