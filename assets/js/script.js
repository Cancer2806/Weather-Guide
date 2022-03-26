const iptSearchCity = document.getElementById("selected-city");



// Call openweather API to get coordinates (long/lat) of City.  If error, advise user that City cannot be found
// Using coordinates of City, call openweather API and get weather by long/lat
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
// If not found, will advise that City could not be found
