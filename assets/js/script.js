let cities = [];

let searchButton = $("#search-button");
let listOfCities = $(".input-group-append");

searchButton.on("click", function (event) {
  event.preventDefault();
  let inputEl = $("#search-input");
  let city = inputEl.val().trim();
  if (city && !cities.includes(city)) {
    cities.push(city);
    let cityButton = $("<button>")
      .text(city)
      .addClass("city-button my-2 btn btn-secondary")
      .attr("id", "cityButton");
    listOfCities.append(cityButton);
    inputEl.val("");
  }

  $.ajax({
    url: buildLocationQueryURL(city),
    method: "GET",
  }).then(function (response) {
    console.log(response);
    let lat = response[0].lat;
    let lon = response[0].lon;
    buildForecastQueryURL(lat, lon);

    $.ajax({
        url: buildForecastQueryURL(lat, lon),
        method: "GET",
      }).then(function (response) {
        console.log(response);
      });
  });
});

function buildLocationQueryURL(city) {
  let locationQueryURL = "http://api.openweathermap.org/geo/1.0/direct?";
  let locationQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  locationQueryParams.q = city;
  console.log(
    "---------------\nURL: " + locationQueryURL + "\n---------------"
  );
  console.log(locationQueryURL + $.param(locationQueryParams));
  return locationQueryURL + $.param(locationQueryParams);
}

function buildForecastQueryURL(lat, lon) {
  let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?";
  let forecastQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  forecastQueryParams.lat = lat;
  forecastQueryParams.lon = lon;
  console.log(
    "---------------\nURL: " + forecastQueryURL + "\n---------------"
  );
  console.log(forecastQueryURL + $.param(forecastQueryParams));
  return forecastQueryURL + $.param(forecastQueryParams);
}
