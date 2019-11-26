var displayName = document.querySelector("#displayname");
var displayTemp = document.querySelector("#temp");
var displayHumid = document.querySelector("#humid");
var displayWind = document.querySelector("#wnd");
var displayUv = document.querySelector("#uvColor");
var forecastDate = document.querySelectorAll(".card-title");
var forecastTemp = document.querySelectorAll(".tempforecast");
var forecastHumid = document.querySelectorAll(".humidforecast");
var forecastIcon = document.querySelectorAll(".forecastIcon");
var searchInput = document.querySelector("#search-input");
var button = document.querySelector("#add-city");
var historyList = document.querySelector("#city-history")

var cityHistory = [];
var city = "Denver";

renderCityHistory();
getforecastWeather();
getCurrentWeather();

button.addEventListener("click", function (event) {
    event.preventDefault();
    var cit = searchInput.value.trim();
    if (cit !== "") {
        city = cit;

        cityHistory.push(city);
        localStorage.setItem("Cities", JSON.stringify(cityHistory))
        searchInput.value = "";
        getforecastWeather();
        getCurrentWeather();
        renderCityHistory();
    }
    else { return }
});






function getforecastWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=b028e5b788903c9ff62781f1cb7270eb"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        console.log(response.list)
        var temperature = [];
        var humidity = [];
        var windSpeed = [];
        var icon = [];
        var description = [];
        var date = [];
        var lat = 0;
        var lon = 0;
        for (i = 0; i < 39; i++) {
            temperature.push(((response.list[i].main.temp - 273.15) * (9 / 5) + 32).toFixed(0))
            humidity.push(response.list[i].main.humidity);
            windSpeed.push(response.list[i].wind.speed);
            icon.push(response.list[i].weather[0].icon);
            description.push(response.list[i].weather[0].description);
            date.push(response.list[i].dt_txt);
        }
        lat = response.city.coord.lat;
        lon = response.city.coord.lon;

        forecast();
        function forecast() {
            var j = 0
            for (i = 0; i < forecastDate.length; i++) {
                forecastDate[0].innerHTML = moment().add(1, 'days').format('MM/DD/YYYY')
                forecastDate[1].innerHTML = moment().add(2, 'days').format('MM/DD/YYYY')
                forecastDate[2].innerHTML = moment().add(3, 'days').format('MM/DD/YYYY')
                forecastDate[3].innerHTML = moment().add(4, 'days').format('MM/DD/YYYY')
                forecastDate[4].innerHTML = moment().add(5, 'days').format('MM/DD/YYYY')
                forecastTemp[i].innerHTML = "Temp: " + temperature[j] + "&#8457";
                forecastHumid[i].innerHTML = "Humidity: " + humidity[j] + "%";
                forecastIcon[i].src = "https://openweathermap.org/img/wn/" + icon[j] + ".png"
                j = j + 8
            };
        }

        var queryUV = "https://api.openweathermap.org/data/2.5/uvi?appid=7a7a18a0877364062aba3b94fdafdc1d&lat=" + lat + "&lon=" + lon + "&cnt=5"
        $.ajax({
            url: queryUV,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            displayUv.textContent = ("" + response.value);
        });

    })

}

function getCurrentWeather() {
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=7a7a18a0877364062aba3b94fdafdc1d"

    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        displayName.innerHTML = city + " - " + moment().format('(MM/DD/YYYY)') + " <img src ='https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png'>"
        displayTemp.innerHTML = "Temperature: " + (((response.main.temp - 273.15) * (9 / 5) + 32).toFixed(0)) + "&#8457";
        displayHumid.innerHTML = "Humidity: " + response.main.humidity + "%";
        displayWind.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
    })
}

function renderCityHistory() {
    var storedCities = JSON.parse(localStorage.getItem("Cities"));
    if (storedCities !== null) {
        cityHistory = storedCities;
        city = cityHistory.slice(-1)[0];
    }

    historyList.innerHTML = "";
    for (var i = 0; i < cityHistory.length; i++) {
        var cityname = cityHistory[i];

        var li = document.createElement("li");
        li.textContent = cityname;
        historyList.appendChild(li);

    }


}