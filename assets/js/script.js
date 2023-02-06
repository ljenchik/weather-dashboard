let searchButton = $("#search-button");
let listOfCities = $(".input-group-append");
let inputEl = $("#search-input");
let currentWeatherEl = $("#today");
let weatherCardsContainer = $("#weather-cards-container");
let cityButton = $("<button>");

cities = getStoredCities();

searchButton.on("click", function (event) {
  event.preventDefault();
  let cityInput = readCityInput();
  displayWeather(cityInput);
});

function displayWeather(cityName) {
  // Location query to get latitude and longitude
  $.ajax({
    url: buildLocationQueryURL(cityName),
    method: "GET",
  }).then(function (response) {
    if (response.length !== 0) {
      let lat = response[0].lat;
      let lon = response[0].lon;

      // Current weather query and 5-day forecast query
      $.when(
        $.ajax(buildWeathertQueryURL(lat, lon)),
        $.ajax(buildForecastQueryURL(lat, lon))
      ).done(function (response1, response2) {
        
        let dayResponse = response1[0];
        let forecastResponse = response2[0].list;

        currentWeatherEl.empty();
        inputEl.val("");
        weatherCardsContainer.empty();

        // Displays current weather
        currentWeatherEl.addClass("today");

        let cityNameEl = $("<h3>").addClass("city-name").text(`${cityName}`);
        let currentDate = moment();
        let dateEl = $("<p>").text(`,  ` + currentDate.format("LL"));

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

        // Displays forecast cards
        for (let i = 1; i < 6; i++) {
          weatherCard(i, forecastResponse);
        }

        // Adds new valid city to the local storage
        if (cityName && !cities.includes(cityName)) {
          createCityButton(cityName);
          saveToLocalStorage(cityName, cities);
        }
      });
    } else {
      // Case of bad location request
      alert("Enter a valid city name");
      inputEl.val("");
    }
  });
}

// Displays weather forecast card for one day out of five
function weatherCard(n, data) {
  let futureDate = moment().add(`${n}`, "days").format("YYYY-MM-DD");
  const day = (element) =>
    moment(element.dt_txt).format("YYYY-MM-DD") === futureDate;
  let index = data.findIndex(day);
  // To display data at 6:00am
  index += 2;

  let dayTemperaturesArray = [];
  for (let i = index; i < index + 8; i++) {
    if (data[i]) {
      dayTemperaturesArray.push(data[i].main.temp);
    }
  }

  // To dispaly max and min temp during the day
  let maxTemp = Math.round(Math.max(...dayTemperaturesArray));
  let minTemp = Math.round(Math.min(...dayTemperaturesArray));

  let dateCardEl = $("<h5>").text(moment(futureDate).format("DD/MM/YYYY"));

  let iconCardEl = $("<img>").attr("src",
  `http://openweathermap.org/img/w/${data[index].weather[0].icon}.png`);

  let cardBody = $("<div>");
  cardBody.append(dateCardEl).addClass('cardbody');

  let iconAndTempsEl = $("<div>").addClass("iconAndTemps");
  let temps = $("<div>").addClass("temps");

    iconAndTempsEl.append(iconCardEl);
    temps.append($("<strong>").text( maxTemp + "º"));
    temps.append($("<p>").text(minTemp + "º"));

  iconAndTempsEl.append(temps);

  cardBody.append(iconAndTempsEl);


  cardBody.append(
    $("<p>").text("Wind: " + data[index].wind.speed.toFixed(1) + " m/s")
  );

  cardBody
    .append($("<p>").text("Humidity: " + data[index].main.humidity + "%"))
    .addClass("card-container");
  weatherCardsContainer.append(cardBody);
}

// Reads the city name from the input field
function readCityInput() {
  let cityInput = inputEl.val().trim();
  // Capitalize the city name
  return cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
}

// Creates city button with event listener
function createCityButton(city) {
  cityButton = $("<button>")
    .text(city)
    .addClass("city-button my-2 btn btn-secondary")
    .attr("id", `${city}`);
  listOfCities.append(cityButton);

  cityButton.on("click", function (event) {
    event.preventDefault();
    inputEl.val("");
    displayWeather(city);
  });
}

// Query buiders
function buildLocationQueryURL(city) {
  let locationQueryURL = "http://api.openweathermap.org/geo/1.0/direct?";
  let locationQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  locationQueryParams.q = city;
  locationQueryParams.mode = "json";
  return locationQueryURL + $.param(locationQueryParams);
}

function buildWeathertQueryURL(lat, lon) {
  let weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?";
  let weatherQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  weatherQueryParams.lat = lat;
  weatherQueryParams.lon = lon;
  weatherQueryParams.units = "metric";
  weatherQueryParams.mode = "json";
  return weatherQueryURL + $.param(weatherQueryParams);
}

function buildForecastQueryURL(lat, lon) {
  let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?";
  let forecastQueryParams = { appid: "61ba8177c893a48d024315792d0535ca" };
  forecastQueryParams.lat = lat;
  forecastQueryParams.lon = lon;
  forecastQueryParams.units = "metric";
  forecastQueryParams.mode = "json";
  return forecastQueryURL + $.param(forecastQueryParams);
}

// Local storage functions
function getStoredCities() {
  if (JSON.parse(localStorage.getItem("storedCities")) !== null) {
    cities = JSON.parse(localStorage.getItem("storedCities"));
    cities.forEach(function (city) {
      createCityButton(city);
    });
  } else {
    cities = [];
  }
  return cities;
}

function saveToLocalStorage(city, cities) {
  cities.push(city);
  localStorage.setItem("storedCities", JSON.stringify(cities));
}
