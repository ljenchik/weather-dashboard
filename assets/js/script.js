let cities = [];
let isValidCityInput;

let searchButton = $("#search-button");
let listOfCities = $(".input-group-append");
let inputEl = $("#search-input");
let currentWeatherEl = $("#today");
let weatherCardsContainer = $("#weather-cards-container");

cities = getStoredCities();
displayStoredCities(cities);

searchButton.on("click", function (event) {
  event.preventDefault();
  let cityInput = readCityInput();

  displayWeather(cityInput).then(function () {
    console.log(isValidCityInput);

    if (isValidCityInput && cityInput && !cities.includes(cityInput)) {
      createCityButton(cityInput);
      saveToLocalStorage(cityInput, cities);
    }
  });
});

function displayWeather(cityName) {
  // Location query to get latitude and longitude
  return $.ajax({
    url: buildLocationQueryURL(cityName),
    method: "GET",
  }).then(function (response) {
    if (response.length !== 0) {
      let lat = response[0].lat;
      let lon = response[0].lon;

      // Current weather query and 5-day forecast query
      return $.when(
        $.ajax(buildWeathertQueryURL(lat, lon)),
        $.ajax(buildForecastQueryURL(lat, lon))
      ).done(function (response1, response2) {
        isValidCityInput = true;
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
    } else {
      isValidCityInput = false;
      alert("Enter a valid city name");
      inputEl.val("");
    }
  });
}

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

function weatherCard(n) {
  let futureDate = moment().add(`${n}`, "days").format("YYYY-MM-DD");
  const day = (element) =>
    moment(element.dt_txt).format("YYYY-MM-DD") === futureDate;
  let index = forecastResponse.findIndex(day);
  // To display data at 6:00am
  index += 2;
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

// Reads city from the input field
function readCityInput() {
  let cityInput = capitalizeFirstLetter(inputEl.val().trim());
  return cityInput;
}

function createCityButton(name) {
  if (name) {
    let cityButton = $("<button>")
      .text(name)
      .addClass("city-button my-2 btn btn-secondary")
      .attr("id", `${name}`);
    listOfCities.append(cityButton);
    cityButton.on("click", function (event) {
      event.preventDefault();
      inputEl.val("");
      displayWeather(name);
    });
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStoredCities() {
  if (JSON.parse(localStorage.getItem("storedCities")) !== null) {
    cities = JSON.parse(localStorage.getItem("storedCities"));
  }
  return cities;
}

function displayStoredCities(cities) {
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

function saveToLocalStorage(city, cities) {
  cities.push(city);
  localStorage.setItem("storedCities", JSON.stringify(cities));
}

// city validation
// disable search button
// empty input when cursor in it
// refactor code
// readme
// screenshots
// api for the 5th day as sometimes it's not enough data to display
