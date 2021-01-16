let APIKey = "166a433c57516f51dfab1f7edaed8413";
let locations = [];

// Here we are building the URL we need to query the One call weather API to retrieve the UV Index.  
//This API requires Geographical coordinates that we get from the 5 day API so we can retirive the 
//UV Index for the current day and the next 5 days and store them in the uvInxex array
function getWeatherData(lat, lon, city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=,minutely,hourly,alerts&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            // console.log(response);

            showWeatherData(response, city);

        });           
 };


 //call the weather API based on ZipCode and call the fucntion showWeatherData to load the values
function loadWeatherZip(zipCpde, isClicked) {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCpde + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) { 

            console.log(response);

            if (!isClicked)
            {
                saveLocations(response);  //save the city and zip to local storage
                renderLocations();
            }


            //load weather
            getWeatherData(response.city.coord.lat, response.city.coord.lon, response.city.name);

        }).catch(function (response){
            alert("Not a vaild Zip Code")
        });
}

function loadWeatherCity(city, isClicked) {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            console.log(response);

            if (!isClicked)
            {
                saveLocations(response);  //save the city and zip to local storage
                renderLocations();
            }

            //load weather
            getWeatherData(response.city.coord.lat, response.city.coord.lon, response.city.name);

        }).catch(function(response){
            alert("Not a valid City");
        });
}

function showWeatherData(weatherData, city)
{
    //load current
    var iconURL = "http://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png";  //get weather icon
    $("#cityDate").html(city + " (" + new Date().toLocaleDateString() + ") <img id=\"icon\" src=\"" + iconURL  + "\" alt=\"Weather icon\"/>");

    var temp = parseInt(weatherData.current.temp);
    temp = Math.round(((temp-273.15)*1.8) + 32);
    $("#currentTemp").html(" " + temp +  "  &degF");
    $("#currentHumidity").html(weatherData.current.humidity + "%");
    $("#currentWindSpeed").html(weatherData.current.wind_speed + " MPH");

    //get the current uv index and store in the uvIndex.current array 
    var uvIndex = weatherData.current.uvi;

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


    //load 5 Day
    var ul5 = $("#fiveDay");
    ul5.empty();

    for (i=1; i < 6; i++)  //we want the days 1-5
    {
        //make the elements to display the 5 day forecast and append to the parent div
        var div = $("<div>").addClass("bg-primary");

        var dateTime = parseInt(weatherData.daily[i].dt); 
        var dateHeading = $("<h6>").text(new Date(dateTime * 1000).toLocaleDateString());  //convert unix time to javascript date
        var iconDayURL = "http://openweathermap.org/img/w/" + weatherData.daily[i].weather[0].icon + ".png";  //get weather icon
        var icon = $("<img>").attr("src", iconDayURL);

        temp = parseInt(weatherData.daily[i].temp.day);  //convert kelvin to Fahrenheit
        temp = Math.round(((temp-273.15)*1.8) + 32);  //convert kelvin to Fahrenheit
        var temp5 = $("<p>").html("Temp: " + temp +  "  &degF");

        var humidity5 = $("<p>").html("Humidity: " + weatherData.daily[i].humidity + "%");

        div.append(dateHeading);
        div.append(icon);
        div.append(temp5);
        div.append(humidity5);
        ul5.append(div);

    }

    $("#weatherData").show();
}

//load locations from local storage to the locations array
function loadLocations()
{
    var locationsArray = localStorage.getItem("locations");
    if (locationsArray) //if not undefined
    {
      locations = JSON.parse(locationsArray);  //make sure there is a locations object in local storage
      renderLocations();
    }
    else {
      localStorage.setItem("locations", JSON.stringify(locations));  //if not make one and store it to local storage
    }
}

function renderLocations()
{
    var divLocations = $("#locationHistory");
    divLocations.empty();  //clear the cities list before rendering it from the local storage object

    $.each(locations, function(index, item){
        var a = $("<a>").addClass("list-group-item list-group-item-action city").attr("data-city", locations[index]).text(locations[index]);
        divLocations.append(a);
    });

    $("#locationHistory > a").off();

    $("#locationHistory > a").click(function (event)
    {   
        var element = event.target;
        var city = $(element).attr("data-city");

        loadWeatherCity(city, true);
    });

}

//save locations to the locations array and local storage
function saveLocations(data)
{

    var city = data.city.name; //get the city came

    locations.unshift(city);
    localStorage.setItem("locations", JSON.stringify(locations));  //convert to a string and sent to local storage

}

$(document).ready(function () {

    $("#weatherData").hide();  //Hide the div that will show all the weather data and we will show it once it is populated

    loadLocations();  //get the locations from local storage and load them to the locations array

    $("#searchBtn").click(function (event) {  //event handler for the city search input
        var element = event.target; //set element to the div that was clicked
        var searchCriteria = $("#zipCode").val();  //get the user input
        
        if (searchCriteria !== "")  //make sure it is not empty
        {
            var zip = parseInt(searchCriteria); //is it a zip code or city name

            if (!isNaN(zip)) //yes it is a zip code
            {
                loadWeatherZip(zip, false);
            }
            else
            {
                loadWeatherCity(searchCriteria, false);  //no, it is a city name
            }
        }
    });
});