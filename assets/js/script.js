// Variables linking to DOM elements
const frmSearchEl = document.querySelector("#city-search");
const iptSearchCityEl = document.getElementById("selected-city");
const txtCurrentPlaceEL = document.getElementById("current-place");
const txtFiveDayEl = document.getElementById("five-day-h2");
const contTodayEl = document.getElementById("today-fcast");
const lstCurrentDayEl = document.getElementById("current-day-result");
const lstPreviousSearchEl = document.getElementById("prev-search");
const contForecastEl = document.getElementById("fcast-container");
const imgWeatherIcon = document.getElementById("weather-icon");

// Global variables and assignments
// const token = config.API_Token;
const key = 'c9ed3e38e273ae3901fcdb4bd62d6919';
const arryNameStore = [];

// Retrieve previously searched cities for selection by User if desired
const writeSavedCities = function () {
  let cityList = JSON.parse(localStorage.getItem("savedCity"));
  lstPreviousSearchEl.textContent = "";
  if (cityList) {
    cityList.sort();
    for (i = 0; i < cityList.length; i++) {
      arryNameStore[i] = cityList[i];
      const btnPrevCity = document.createElement('button');
      btnPrevCity.textContent = cityList[i];
      btnPrevCity.setAttribute('name', cityList[i]);
      btnPrevCity.classList.add('btn-prev');
      lstPreviousSearchEl.appendChild(btnPrevCity);
    }
  }
  return;
}

// Obtain weather data if previously searched city is selected
const prevCitySelected = function (event) {
  event.preventDefault();
  // Get city coordinates
  getCityCoords(event.target.getAttribute('name'))
    .then(function (data) {
      let txtCity = `${data[0].name}, ${data[0].country}`;
      txtCurrentPlaceEL.textContent = data[0].name + ", " + data[0].country;

      // Using city coordinates, call openweather API and get weather data
      getWeather(data[0].lon, data[0].lat)
        .then(function (weatherData) {
          extractWeather(weatherData);
        })
    })
  return;
}

// Call to Geocode API to get city coordinates
const getCityCoords = function (city) {
  const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${key}`

  return fetch(apiUrl)
    .then(function(response) {
      return response.json();
    });
}

// call to openweathermap to get weather by coordinates
const getWeather = function (lon, lat) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${key}&units=metric`;

  return fetch(apiUrl)
    .then(function (response) {
      // console.log(response);
      return response.json();
    });
}

// Function to render the five day forecast to the web-page
const buildFiveDay = function (fcastObj) {
  contForecastEl.textContent = "";
  txtFiveDayEl.textContent = "Five Day Forecast:"
  for (i = 0; i < 5; i++) {
    const card = document.createElement('div');
    card.classList.add("day-card")
    const cardTitle = document.createElement('h3');
    cardTitle.classList.add("card-title");
    const cardImage = document.createElement('img');
    const cardList = document.createElement('ul');

    cardTitle.textContent = fcastObj[i].date;
    cardImage.src = `https://openweathermap.org/img/wn/${fcastObj[i].iconCode}@2x.png`;
    card.appendChild(cardTitle);
    card.appendChild(cardImage);

    const liTempMax = document.createElement('li');
    liTempMax.textContent = "Temp Max: " + fcastObj[i].tempMax + "°C";
    const liTempMin = document.createElement('li');
    liTempMin.textContent = "Temp Min: " + fcastObj[i].tempMin + "°C";
    const liWind = document.createElement('li');
    liWind.textContent = "Wind:  " + fcastObj[i].wind + "km/hour";
    const liHumidity = document.createElement('li');
    liHumidity.textContent = "Humidity:  " + fcastObj[i].humidity + "%";
  
    // Append to card list
    cardList.appendChild(liTempMax);
    cardList.appendChild(liTempMin);
    cardList.appendChild(liWind);
    cardList.appendChild(liHumidity);
    card.appendChild(cardList);
    // Append to container on web-page
    contForecastEl.appendChild(card);
  }
  return;
}

// Function to render the current day information to the web-page
const buildCurrentDay = function (today) {
  // Log current Days Weather to Screen
  // Clear previous data, if any
  lstCurrentDayEl.textContent = "";
  // Create current day's elements
  txtCurrentPlaceEL.textContent = txtCurrentPlaceEL.textContent + " (" + today.date + ")";
  imgWeatherIcon.src = `https://openweathermap.org/img/wn/${today.iconCode}@2x.png`;
  const liTemp = document.createElement('li');
  liTemp.textContent = "Temp: " + today.temp + "°C";
  const liWind = document.createElement('li');
  liWind.textContent = "Wind:  " + today.wind + "km/hour";
  const liHumidity = document.createElement('li');
  liHumidity.textContent = "Humidity:  " + today.humidity + "%";

  // Add Color to UVI Index
  const liUvi = document.createElement('li');
  liUvi.textContent = "UVI:  " + today.uvi;
  if (today.uvi < 3) {
    liUvi.innerHTML = "UVI:  " + "<span class='green'>" + today.uvi + "</span>";
  } else if (today.uvi < 8) {
    liUvi.innerHTML = "UVI:  " + "<span class='yellow'>" + today.uvi + "</span>";
  } else {
    liUvi.innerHTML = "UVI:  " + "<span class='red'>" + today.uvi + "</span>";
  }

  // Append to list container in html
  lstCurrentDayEl.appendChild(liTemp);
  lstCurrentDayEl.appendChild(liWind);
  lstCurrentDayEl.appendChild(liHumidity);
  lstCurrentDayEl.appendChild(liUvi);
  return;
}

// Extract the required weather information from the returned data
const extractWeather = function(weatherData) {
  // Object to hold relevant information for the current day
  const currentDay = {
    date: moment.unix(weatherData.current.dt).format('dddd, MMMM Do, YYYY'),
    temp: weatherData.current.temp,
    uvi: weatherData.current.uvi,
    iconCode: weatherData.current.weather[0].icon,
    wind: weatherData.current.wind_speed,
    humidity: weatherData.current.humidity,
  }
  
  // Array containing and object for each day of forecast.  Object contains the relevant information for that day
  const arryDaily = [];

  for (i = 1; i < 6; i++) {
    tempObj = {
      date: moment.unix(weatherData.daily[i].dt).format('MMMM Do, YYYY'),
      tempMax: weatherData.daily[i].temp.max,
      tempMin: weatherData.daily[i].temp.min,
      iconCode: weatherData.daily[i].weather[0].icon,
      wind: weatherData.daily[i].wind_speed,
      humidity: weatherData.daily[i].humidity,
    }
    arryDaily.push(tempObj);
  }
  // Render the data to the web-page
  buildCurrentDay(currentDay);
  buildFiveDay(arryDaily);
  return;
}
  
// Search for a new city and add to local storage for future previously searched lists
const searchByCity = function (event) {
  event.preventDefault();
  const cityName = iptSearchCityEl.value.trim();
    
  // Call openweather API to get coordinates (long/lat) of City
  if (cityName != "" || null) {
    getCityCoords(cityName)
      .then(function (data) {
        let txtCity = `${data[0].name}, ${data[0].country}`;
        txtCurrentPlaceEL.textContent = data[0].name + ", " + data[0].country;
              
        // Using coordinates of City, call openweather API and get weather by long/lat
        getWeather(data[0].lon, data[0].lat)
          .then(function (weatherData) {
            // Write city name to local storage
            arryNameStore.push(txtCity);
            localStorage.setItem("savedCity", JSON.stringify(arryNameStore));
            writeSavedCities();
            extractWeather(weatherData);
          })
      })
  }
  return;
}
 
// On starting, retrieve previous cities
writeSavedCities();

// Event Listener:  User has entered a City to search.
// Will call function to search for the City entered by the User.  If found, will display the weather
frmSearchEl.addEventListener('submit', searchByCity);

// Event Listener:  User has clicked on a previously searched city (could have a listener on whole block, and use button names as parameters)
lstPreviousSearchEl.addEventListener('click', prevCitySelected);