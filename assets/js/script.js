const frmSearchEl = document.querySelector("#city-search");
const iptSearchCityEl = document.getElementById("selected-city");

const token = config.API_Token;
const key = config.API_Key;
const arryDaily = [];

const getCityCoords = function (city) {
  
  const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${key}`

  return fetch(apiUrl)
    .then(function(response) {
      return response.json();
    });
}

const getWeather = function (lon, lat) {
  console.log(`long is ${lon} and lat is ${lat}`);

  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${key}&units=metric`;

  return fetch(apiUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    });
}

const buildDailyForecast = function(weatherData) {
  
  const currentDay = {
    date: moment.unix(weatherData.current.dt),
    temp: weatherData.current.temp,
    uvi: weatherData.current.uvi,
    icon: weatherData.current.weather.icon,
    wind: weatherData.current.wind_speed,
    humidity: weatherData.current.humidity,
  }

  // reset the forecast array to prevent appending
  // may not need this if converting to cards, but will need a method to refresh if a different city is chosen
  arryDaily.length = 0;

  for (idx = 1; idx < 6; idx++) {
    tempObj = {
      date: moment.unix(weatherData.daily[idx].dt),
      tempMax: weatherData.daily[idx].temp.max,
      tempMin: weatherData.daily[idx].temp.min,
      icon: weatherData.daily[idx].weather.icon,
      wind: weatherData.daily[idx].wind_speed,
      humidity: weatherData.daily[idx].humidity,
    }
    arryDaily.push(tempObj);
  }
}
  
const searchByCity = function (event) {
  event.preventDefault();
  const cityName = iptSearchCityEl.value.trim();
  console.log(cityName);

  // Place into local storage

  // TO DO  If error, advise user that City cannot be found

  // Call openweather API to get coordinates (long/lat) of City
  getCityCoords(cityName)
    .then(function(data) {
      console.log(`city ${data[0].name}`)
      
      // Using coordinates of City, call openweather API and get weather by long/lat
      getWeather(data[0].lon, data[0].lat)
        .then(function (weatherData) {
          buildDailyForecast(weatherData);
          
        })
    })
  return;
}

 


// Daily Weather:  Display City Name (Date in brackets) as a heading, with weather icon alongside
// Below display the weather, wind, Humidity and UV Index.  UV Index to be color-coded

// Below Daily Weather, display five day forecast: Date, icon, temp, wind, humidity

// If new search, place selected city into local storage


// on starting, retrieve previous cities searched from local storage and display beneath the search input, as selectable buttons, with a line divider

// Work out how to keep API key safe - call openweather requires an API key



// Event Listener:  User has clicked on a previously searched city (could have a listener on whole block, and use button names as parameters)
// If a previously searched city is called, will display the weather for that city



// Event Listener:  User has entered a City to search or clicked on a previously searched city
// Will call function to search for the City entered by the User.  If found, will display the weather
// TO DO If not found, will advise that City could not be found

frmSearchEl.addEventListener('submit', searchByCity);