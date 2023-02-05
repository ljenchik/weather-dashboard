let cities = [];
let searchButton = $("#search-button");
let listOfCities = $(".input-group-append");
let inputEl = $("#search-input");
let currentWeatherEl = $("#today");
let forecastEl = $("#forecast");

let cityName;

searchButton.on("click", function (event) {
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
  } else {
    alert("Please, enter city");
  }

  // Location query to get latitude and longitude
  $.ajax({
    url: buildLocationQueryURL(city),
    method: "GET",
  }).then(function (response) {
    let lat = response[0].lat;
    let lon = response[0].lon;
    buildWeathertQueryURL(lat, lon);
    console.log(buildWeathertQueryURL(lat, lon));
    buildForecastQueryURL(lat, lon);
    console.log(buildForecastQueryURL(lat, lon));

    $.when(
      $.ajax(buildWeathertQueryURL(lat, lon)),
      $.ajax(buildForecastQueryURL(lat, lon))
    ).done(function (response1, response2) {
      console.log(response1[0]);
      console.log(response2[0].list);

      dayResponse = response1[0];
      forecastResponse = response2[0].list;

      // Display current weather
      currentWeatherEl.addClass("today");
      let cityNameEl = $("<h3>").addClass("city-name").text(`${cityName}, `);
      let currentDate = moment();

      let dateEl = $("<p>").text(currentDate.format("LL"));
      let iconEl = $("<img>").attr(
        "src",
        `http://openweathermap.org/img/w/${dayResponse.weather[0].icon}.png`
      );

      currentWeatherEl.append(cityNameEl);
      currentWeatherEl.append(dateEl);
      currentWeatherEl.append(iconEl);

      currentWeatherEl.append(
        $("<div>").text(
          "Tempreture: " + Math.round(dayResponse.main.temp) + "ºC"
        )
      );
      currentWeatherEl.append(
        $("<div>").text("Wind: " + dayResponse.wind.speed.toFixed(1) + " m/s")
      );
      currentWeatherEl.append(
        $("<div>").text("Humidity: " + dayResponse.main.humidity + "%")
      );

      // Display forecast
      const correctDay = (element) => moment(element.dt_txt).format("YYYY-MM-DD") === moment().add(1, 'days').format("YYYY-MM-DD");
      let index = forecastResponse.findIndex(correctDay);
      // To display data at 12:00 
      index += 4;

      let dateCardEl = $("<h5>").text(
        moment("2023-02-06 00:00:00").format("DD/MM/YYYY")
      );

      let iconCardEl = $("<div>").append($("<img>").attr(
        "src",
        `http://openweathermap.org/img/w/${forecastResponse[index].weather[0].icon}.png`
      ));

      let tempCardEl = $("<p>").text("Temperature: " + 
        Math.round(forecastResponse[index].main.temp)  + "ºC"
      );

      let windCardEl = $("<p>").text("Wind: " + forecastResponse[index].wind.speed.toFixed(1) + " m/s");

      let humidityCardEl = $("<p>").text("Humidity: " + forecastResponse[index].main.humidity + "%");


      $("#forecast").append(dateCardEl);
      $("#forecast").append(iconCardEl);
      $("#forecast").append(tempCardEl);
      $("#forecast").append(windCardEl);
      $("#forecast").append(humidityCardEl);
      $("#forecast").addClass("card-container");


      // console.log(temp1)
      // console.log(Math.round(Math.max(...temp1)));
      // console.log(Math.round(Math.min(...temp1)));

      // let minTemp = Math.round(Math.min(...temp1));
      // let maxTemp = Math.round(Math.max(...temp1));

      // // Current weather query to get data to display at the top of the page
      // $.ajax({
      //   url: buildWeathertQueryURL(lat, lon),
      //   method: "GET",
      // }).then(function(response) {
      //   console.log(response);

      //   currentWeatherEl.addClass("today");

      //   let cityNameEl = $("<h3>").addClass("city-name").text(`${cityName}, `);
      //   let currentDate = moment();

      //   let dateEl = $("<p>").text(currentDate.format("LL"));
      //   let iconEl = $("<img>").attr(
      //     "src",
      //     `http://openweathermap.org/img/w/${response.weather[0].icon}.png`
      //   );

      //   currentWeatherEl.append(cityNameEl);
      //   currentWeatherEl.append(dateEl);
      //   currentWeatherEl.append(iconEl);

      //   currentWeatherEl.append(
      //     $("<div>").text("Tempreture: " + Math.round(response.main.temp) + "ºC")
      //   );
      //   currentWeatherEl.append(
      //     $("<div>").text("Wind: " + response.wind.speed.toFixed(1) + " m/s")
      //   );
      //   currentWeatherEl.append(
      //     $("<div>").text("Humidity: " + response.main.humidity + "%")
      //   );
      // });

      // // 5-day forecast to display
      // $.ajax({
      //   url: buildForecastQueryURL(lat, lon),
      //   method: "GET",
      // }).then(function (response) {
      //   response = response.list;
      //   console.log(response);

      //   let day1 = response.slice(0, 8);
      //   console.log(day1);
      //   let temp1 = [];
      //   day1.forEach(function(item) {
      //     temp1.push(item.main.temp)
      //   })
      //   console.log(temp1)
      //   console.log(Math.round(Math.max(...temp1)));
      //   console.log(Math.round(Math.min(...temp1)));

      //   $("#card1 card-title").text(moment());
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

function buildForecastQueryURL(lat, lon) {
  let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?";
  let forecastQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  forecastQueryParams.lat = lat;
  forecastQueryParams.lon = lon;
  forecastQueryParams.units = "metric";
  return forecastQueryURL + $.param(forecastQueryParams);
}

// city validation
