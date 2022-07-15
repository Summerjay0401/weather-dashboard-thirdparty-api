const apiKey = "aa36a844fba95acf512863f721e290fb";
const today = moment().format('L');
const day = moment().format('dddd');

const getWeatherByCity = async function(cityName){
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(function(response){ // response => response.json()
        return response.json()
    })
    .then(data=>data)
}

const getWeatherIcon = function(iconCode){
    return `https://openweathermap.org/img/w/${iconCode}.png`
}

const renderCityInfo = function (cityInfo){
    const iconCode = cityInfo.weather[0].icon;
    const iconURL = getWeatherIcon(iconCode);
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
    `;
    document.getElementById("city-weather-details").innerHTML = currentCity;
    displayWeatherContent (true);
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

// - click history will render city info
// 5 day forecast
// `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
// -        // displays the date
            // an icon representation of weather conditions
            // the temperature
            // the humidity
            // wind speed
// alert if humidity is high
// uv index


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



window.addEventListener('load', (event) => {
    renderSearchHistory();
  });
  