let APIKey = "166a433c57516f51dfab1f7edaed8413";
let uvIndex = "";  //hold the UV Index's


// Here we are building the URL we need to query the One call weather API to retrieve the UV Index.  
//This API requires Geographical coordinates that we get from the 5 day API so we can retirive the 
//UV Index for the current day and the next 5 days and store them in the uvInxex array
function getUVIndex(lat, lon) {

    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=,minutely,hourly,alerts&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            //get the current uv incex and store in the uvIndex.current array 
            uvIndex = response.current.uvi;
            
            var bgColor = "";  //holds the background color for UV Index
            var textColor = "";  //holds the text color for UV Index

            if (uvIndex < 3) //if uv index is low (1-2)
            {
                bgColor = "bg-success";
                textColor = "text-light";  
            }
            else if (uvIndex > 2 && uvIndex < 6)  //if uv index is mocerate (3-5)
            {
                bgColor = "bg-warning";
                textColor = "text-dark";             
            }
            else  //if uv index is high (6+)
            {
                bgColor = "bg-danger";
                textColor = "text-light";            
            }

            $("#currentUVIndex").html(uvIndex).addClass(bgColor + " p-1 " +  textColor); //set the UVIndex and color to the html
        });           
 };


 //call the weather API based on ZipCode and call the fucntion showWeatherData to load the values
function loadWeatherZip(zipCpde) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCpde + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            //load weather
            showWeatherData(response);

        });
}

function loadWeatherCity(strZip) {

    
    zipCode = strZip;
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            //load weather
            showWeatherData(response);
        });
}



function showWeatherData(weatherData)
{
    console.log(weatherData);
    var iconURL = "http://openweathermap.org/img/w/" + weatherData.list[0].weather[0].icon + ".png";  //get weather icon
    $("#cityDate").html(weatherData.city.name + " (" + new Date().toLocaleDateString() + ") <img id=\"icon\" src=\"" + iconURL  + "\" alt=\"Weather icon\"/>");

    var temp = parseInt(weatherData.list[0].main.temp);
    temp = Math.round(((temp-273.15)*1.8) + 32);
    $("#currentTemp").html(" " + temp +  "  &degF");
    $("#currentHumidity").html(weatherData.list[0].main.humidity + "%");
    $("#currentWindSpeed").html(weatherData.list[0].wind.speed + " MPH");
    getUVIndex(weatherData.city.coord.lat, weatherData.city.coord.lon);

    $("#currentWeather").show();
}

$(document).ready(function () {

    $("#currentWeather").hide();

    $("#searchBtn").click(function (event) {
        var element = event.target; //set element to the div that was clicked
        var searchCriteria = $("#zipCode").val();
        
        if (searchCriteria !== "")
        {
            var zip = parseInt(searchCriteria);

            if (!isNaN(zip))
            {
                loadWeatherZip(zip);
            }
            else
            {
                loadWeatherCity(searchCriteria);
            }
        }
    });
});