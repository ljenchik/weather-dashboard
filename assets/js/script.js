let cities = [];
let searchButton = $("#search-button");
let listOfCities = $(".input-group-append");
let inputEl = $("#search-input");
let currentWeatherEl = $("#today");
let cityName;
let weatherCardsContainer = $("#weather-cards-container");

searchButton.on("click", function (event) {
  event.preventDefault();
  handleCityInput();
  displayWeather(cityName);
});

function displayWeather(cityName) {
  // Location query to get latitude and longitude
  $.ajax({
    url: buildLocationQueryURL(cityName),
    method: "GET",
  }).then(function (response) {
    let lat = response[0].lat;
    let lon = response[0].lon;
    buildWeathertQueryURL(lat, lon);
    buildForecastQueryURL(lat, lon);

    // Current weather query and 5-day forecast query
    $.when(
      $.ajax(buildWeathertQueryURL(lat, lon)),
      $.ajax(buildForecastQueryURL(lat, lon))
    ).done(function (response1, response2) {
      let dayResponse = response1[0];
      forecastResponse = response2[0].list;

      currentWeatherEl.empty();
      inputEl.empty();
      weatherCardsContainer.empty();

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

      // Display forecast cards
      for (let i = 1; i < 6; i++) {
        weatherCard(i);
      }
    });
  });
}

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

function weatherCard(n) {
  let futureDate = moment().add(`${n}`, "days").format("YYYY-MM-DD");
  const day = (element) =>
    moment(element.dt_txt).format("YYYY-MM-DD") === futureDate;
  let index = forecastResponse.findIndex(day);
  // To display data at 12:00
  index += 4;
  let dateCardEl = $("<h5>").text(moment(futureDate).format("DD/MM/YYYY"));

  let iconCardEl = $("<div>").append(
    $("<img>").attr(
      "src",
      `http://openweathermap.org/img/w/${forecastResponse[index].weather[0].icon}.png`
    )
  );
  let tempCardEl = $("<p>").text(
    "Temperature: " + Math.round(forecastResponse[index].main.temp) + "ºC"
  );
  let windCardEl = $("<p>").text(
    "Wind: " + forecastResponse[index].wind.speed.toFixed(1) + " m/s"
  );
  let humidityCardEl = $("<p>").text(
    "Humidity: " + forecastResponse[index].main.humidity + "%"
  );

  let cardBody = $("<div>");
  cardBody.append(dateCardEl);
  cardBody.append(iconCardEl);
  cardBody.append(tempCardEl);
  cardBody.append(windCardEl);
  cardBody.append(humidityCardEl);
  cardBody.addClass("card-container");
  weatherCardsContainer.append(cardBody);
}

function handleCityInput() {
  let city = capitalizeFirstLetter(inputEl.val().trim());
  if (city && !cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("storedCities", JSON.stringify(cities));

    let cityButton = $("<button>")
      .text(city)
      .addClass("city-button my-2 btn btn-secondary")
      .attr("id", `${city}`);
    listOfCities.append(cityButton);

    cityName = city;
    inputEl.val("");

    cityButton.on("click", function (event) {
      event.preventDefault();
      cityName = cityButton.attr("id");
      displayWeather(cityName);
    });

  } else {
    alert("Please, enter city");
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStoredCitiesAndDisplay() {
  if (JSON.parse(localStorage.getItem("storedCities")) !== null) {
    cities = JSON.parse(localStorage.getItem("storedCities"));
  }
  cities.forEach(function (city) {
    let cityButton = $("<button>")
      .text(city)
      .addClass("city-button my-2 btn btn-secondary")
      .attr("id", `${city}`);
    listOfCities.append(cityButton);

    cityButton.on("click", function (event) {
      event.preventDefault();
      cityName = cityButton.attr("id");
      displayWeather(cityName);
    });
  });
}

getStoredCitiesAndDisplay();

// city validation
// disable search button
// refactor code
// readme
// screenshots
