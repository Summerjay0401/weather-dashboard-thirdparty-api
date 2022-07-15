const apiKey = "aa36a844fba95acf512863f721e290fb";

const getWeatherByCity = async function(cityName){
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then(response=>response.json())
    .then(data=>data)
}

const getWeatherIcon = async function(iconCode){
    return `https://openweathermap.org/img/w/${iconCode}.png`
}

document.getElementById("search-button").addEventListener("click", async (event)=>{
    event.preventDefault(); 
    const cityName = document.getElementById("input-enter-city").value;
    const cityInfo = await getWeatherByCity(cityName);
    let iconCode = cityInfo.weather[0].icon;
    const icon = await getWeatherIcon(iconCode);
    console.log(icon);
})