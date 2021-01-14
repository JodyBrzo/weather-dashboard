let APIKey = "166a433c57516f51dfab1f7edaed8413";
let zipCode = "";
let uvIndex  = "";  //hold the UV Index's


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
            
            console.log(uvIndex);

        });
};


$(document).ready(function () {

    zipCode = prompt("enter zip code");

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipCode + ",us&appid=" + APIKey;
    var weatherContainer = $("#weatherContainer");

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            // var lat = response.city.coord.lat;
            // var lon = response.city.coord.lon;
            


            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);
            console.log(response.city.name);
            console.log(response.list[0].main.temp);
            console.log(response.list[0].main.humidity);
            // console.log(response);
            // console.log(response);
            // console.log(response);
            // console.log(response);

            getUVIndex(response.city.coord.lat, response.city.coord.lon);

            weatherContainer.append("<div id=\"weather\"" + "class=\"row\"></div>"); //make a new row with the id of time[i] and append it as a child of the container
            // $("#weather").append("<div id=\"title \" class=\"col-12 title text-center font-weight-bold\"></div>");
            // $("#weather").append("<h1 id=\"title \" class=\"col-12 title text-center font-weight-bold\">Weather Dashboard</h1>");
            $("#weather").append("<div id=\"title \" class=\"col-12 title text-center font-weight-bold\"><h1>Weather Dashboard</h1></div>");
            // $("#weather").append("<h1 id=\"title \" class=\"col-12 title text-center font-weight-bold\">Weather Dashboard</h1>");




        });
});



// $(document).ready(function () {

//     zipCode = prompt("enter zip code");
//     var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
//         "zip=" + zipCode + ",&appid=" + APIKey;
//     var weatherContainer = $("#weatherContainer");

//     // Here we run our AJAX call to the OpenWeatherMap API
//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     })
//         // We store all of the retrieved data inside of an object called "response"
//         .then(function (response) {

//             // Log the queryURL
//             console.log(queryURL);

//             // Log the resulting object
//             console.log(response);
//             console.log(response.name);
//             console.log(response.main.temp);
//             console.log(response.main.humidity);
//             console.log(response);
//             console.log(response);
//             console.log(response);
//             console.log(response);


//             weatherContainer.append("<div id=\"weather\"" + "class=\"row\"></div>"); //make a new row with the id of time[i] and append it as a child of the container
//             // $("#weather").append("<div id=\"title \" class=\"col-12 title text-center font-weight-bold\"></div>");
//             // $("#weather").append("<h1 id=\"title \" class=\"col-12 title text-center font-weight-bold\">Weather Dashboard</h1>");
//             $("#weather").append("<div id=\"title \" class=\"col-12 title text-center font-weight-bold\"><h1>Weather Dashboard</h1></div>");
//             // $("#weather").append("<h1 id=\"title \" class=\"col-12 title text-center font-weight-bold\">Weather Dashboard</h1>");




//         });
// });
