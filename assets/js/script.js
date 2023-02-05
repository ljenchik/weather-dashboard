let cities = [];
let searchButton = $("#search-button");
let listOfCities = $(".input-group-append");
let inputEl = $("#search-input");
let currentWeatherEl = $("#today");
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
    //forecastEl.empty();
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
      let weatherCardsContainer = $("#weather-cards-container");
      
      // Day1
      const day1 = (element) => moment(element.dt_txt).format("YYYY-MM-DD") === moment().add(1, 'days').format("YYYY-MM-DD");
      let index = forecastResponse.findIndex(day1);
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

      let cardBody1 = $("<div>");
      cardBody1.append(dateCardEl);
      cardBody1.append(iconCardEl);
      cardBody1.append(tempCardEl);
      cardBody1.append(windCardEl);
      cardBody1.append(humidityCardEl);
      cardBody1.addClass("card-container");
      weatherCardsContainer.append(cardBody1);

     
     // Day2
     const day2 = (element) => moment(element.dt_txt).format("YYYY-MM-DD") === moment().add(2, 'days').format("YYYY-MM-DD");
     let index2 = forecastResponse.findIndex(day2);
     // To display data at 12:00 
     index2 += 4;
     let dateCardEl2 = $("<h5>").text(
       moment("2023-02-07 00:00:00").format("DD/MM/YYYY")
     );

     let iconCardEl2 = $("<div>").append($("<img>").attr(
       "src",
       `http://openweathermap.org/img/w/${forecastResponse[index2].weather[0].icon}.png`
     ));
     let tempCardEl2 = $("<p>").text("Temperature: " + 
       Math.round(forecastResponse[index].main.temp)  + "ºC"
     );
     let windCardEl2 = $("<p>").text("Wind: " + forecastResponse[index2].wind.speed.toFixed(1) + " m/s");
     let humidityCardEl2= $("<p>").text("Humidity: " + forecastResponse[index2].main.humidity + "%");

     let cardBody2 = $("<div>");
     cardBody2.append(dateCardEl2);
     cardBody2.append(iconCardEl2);
     cardBody2.append(tempCardEl2);
     cardBody2.append(windCardEl2);
     cardBody2.append(humidityCardEl2);
     cardBody2.addClass("card-container");
     weatherCardsContainer.append(cardBody2);
      
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
