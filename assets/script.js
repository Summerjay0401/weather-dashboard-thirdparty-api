const apiKey = "aa36a844fba95acf512863f721e290fb";
const today = moment().format('L');
const day = moment().format('dddd');

const getWeatherByCity = async function(cityName){
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data=>data)
}

const getUvIndex = async function(latitude,longitude){
    return fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data=>data)
}

const getFiveDayForecast = async function(latitude,longitude){
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`)
        .then(response => response.json())
        .then(data=>data)
}


const getWeatherIcon = function(iconCode){
    return `https://openweathermap.org/img/w/${iconCode}.png`
}

const renderCityInfo = async function (cityInfo){
    const iconCode = cityInfo.weather[0].icon;
    const iconURL = getWeatherIcon(iconCode);
    const uvIndex = await getUvIndex(cityInfo.coord.lat,cityInfo.coord.lon);
    console.log(uvIndex);
    console.log(cityInfo);
    const currentCity = `
        <h2 id="currentCity">
            ${cityInfo.name} <img src="${iconURL}" alt="${cityInfo.weather[0].description}" />
        </h2>
        <h3 id="currentDay">
            ${day} ${today} 
        </h3>
        <p>Temperature: ${cityInfo.main.temp} °F</p>
        <p>Humidity: ${cityInfo.main.humidity}\%</p>
        <p>Wind Speed: ${cityInfo.wind.speed} MPH</p>
        <p>UV Index: 
            <span id="uv-index-color" class="px-2 py-2 rounded">${uvIndex.value}</span>
        </p>
    `;
    document.getElementById("city-weather-details").innerHTML = currentCity;
    renderUvIndexColor(uvIndex.value);
    renderFiveDayForecast(uvIndex);
    displayWeatherContent (true);
}

const renderUvIndexColor = function (uvIndex){
    const uvIndexColor = document.getElementById("uv-index-color")
    if (uvIndex > 0 && uvIndex < 3) {
        uvIndexColor.style.backgroundColor = "#3EA72D";
        uvIndexColor.style.color = "white";
    } else if (uvIndex > 3 && uvIndex < 6) {
        uvIndexColor.style.backgroundColor = "#FFF300";
    } else if (uvIndex > 6 && uvIndex < 8) {
        uvIndexColor.style.backgroundColor = "#F18B00";
    } else if (uvIndex > 8 && uvIndex < 11) {
        uvIndexColor.style.backgroundColor = "#E53210";
        uvIndexColor.style.color = "white";
    } else {
        uvIndexColor.style.backgroundColor = "#B567A4";
        uvIndexColor.style.color = "white";
    };  
}

const displayWeatherContent = function (isDisplay){
    if (isDisplay === true)
        document.getElementById("weather-content").style.display = "block";
    else
        document.getElementById("weather-content").style.display = "none"; 
}

const getSearchHistory = function () {
    const listofCityNames = localStorage.getItem('searchHistory')
    return listofCityNames === null ? [] : JSON.parse(listofCityNames);
}

// local storage
const saveCityNameToLocalStorage = function (cityName){ 
    let searchHistory = getSearchHistory();
    if (searchHistory.includes(cityName)===false){
        searchHistory.push(cityName);
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

const renderSearchHistory = function (){
    const searchHistory = getSearchHistory(); 
    const searchHistorySection = document.getElementById('search-history-list');
    searchHistorySection.innerHTML = "";
    searchHistory.forEach(cityName => {
        // ✅ Create element
        const el = document.createElement('li');

        // ✅ Add classes to element
        el.classList.add('list-group-item');
        el.style.cursor="pointer";
        // ✅ Add text content to element
        el.textContent = cityName;
        el.addEventListener("click", async (event)=>{
            event.preventDefault(); 
            const cityInfo = await getWeatherByCity(event.target.textContent);
            renderCityInfo(cityInfo);
        })
        searchHistorySection.append(el);
    });
}

const renderFiveDayForecast = async function(uvIndex){

  const forecast = await getFiveDayForecast(uvIndex.lat, uvIndex.lon);
  const dailyWeather = forecast.daily;
  let dayCard = "";

  for (let i = 0; i<5; i++){
    const day = dailyWeather[i];

    let currDate = moment.unix(day.dt).format("MM/DD/YYYY");
    let currDay = moment.unix(day.dt).format('dddd');
    let iconURL = getWeatherIcon (day.weather[0].icon);

    dayCard = dayCard + `
        <div class="card-body m-3">
            <h5>${currDate}</h5>
            <h5>${currDay}</h5>
            <p><img src="${iconURL}" /></p>
            <p>Temp: ${day.temp.day} °F</p>
            <p>Humidity: ${day.humidity}\%</p>
            <p>Wind Speed: ${day.wind_speed}
        </div>
    `;
  }

  document.getElementById ("five-day-forecast").innerHTML = dayCard;
}

// search button click event
document.getElementById("search-button").addEventListener("click", async (event)=>{
    event.preventDefault(); 

    // this will get the city in the search input text
    const cityName = document.getElementById("input-enter-city").value;

    // upon getting the cityName we need to get the city info from the open weather api
    const cityInfo = await getWeatherByCity(cityName);
    // displays the city info that we get from the api
    renderCityInfo(cityInfo);

    saveCityNameToLocalStorage(cityInfo.name);

    renderSearchHistory();
    //local storage
    // localStorage.getItem(keyname)
})

// this will fire on page load
window.addEventListener('load', (event) => {
    renderSearchHistory();
});
  