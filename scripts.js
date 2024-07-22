//Sélections des éléments importants
var c = "0";
var fl = "0";
var object = {};

let region = document.getElementById('region');

let C = document.getElementById('cursor1');
let F = document.getElementById('cursor2');
C.addEventListener("click", function(){
    C.style.border = "1px solid black";
    C.style.backgroundColor = "rgb(212, 199, 199)";
    F.style.border = "0px solid black";
    F.style.backgroundColor = "transparent";
    Temp.innerHTML = String(Number(c).toFixed(2));
    feelsLike.innerHTML = String(Number(fl).toFixed(2));
});
F.addEventListener("click", function(){
    C.style.border = "0px solid black";
    C.style.backgroundColor = "transparent";
    F.style.border = "1px solid black";
    F.style.backgroundColor = "rgb(212, 199, 199)";
    Temp.innerHTML = String((Number(c)*(9/5) + 32).toFixed(2));
    feelsLike.innerHTML = String((Number(fl)*(9/5) + 32).toFixed(2));
});

let Temp = document.getElementById('Temp');
let feelsLike = document.getElementById('feelslike');

let tminmax = document.getElementById("tminmax");
let weatherimg = document.getElementById("weather_image");
let weatherstate = document.getElementById("weather_state");
let weatherstate_description = document.getElementById('weather_state_precision');
function capitalizeFirstLetter(sentence) {
    return sentence.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}
let day = document.getElementById("day");
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let date = document.getElementById("Date");


let texts = document.getElementsByClassName("text");
let messages = document.getElementsByClassName("message");


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
day.innerHTML = days[(new Date()).getDay()];


function displayValues (object, num)
{
    console.log(object);
    //La région
    region.setAttribute("placeholder", object.city.name);

    //La température actuelle et le feels like
    c = object.list[num].main.temp;
    C.style.border = "1px solid black"
    F.style.border = "0px solid black";
    Temp.innerHTML = String(Number(c).toFixed(2));

    fl = object.list[num].main.feels_like;
    feelsLike.innerHTML = String(Number(fl).toFixed(2));


    //Humidité, visibilité, vitesse et direction du vent, pression de l'air
    let humidity = object.list[num].main.humidity;
    let visibility = object.list[num].visibility;
    let windspeed = object.list[num].wind.speed;
    let deg = object.list[num].wind.deg;
    let pressure = object.list[num].main.pressure;

    let degConverted = ((deg >= 0 && deg <= 22.5) || (deg >= 337.5 && deg <= 360))? "N":(deg >= 67.5 && deg <= 112.5)? "E":(deg >= 157.5 && deg <= 202.5)? "S":(deg >= 247.5 && deg <= 292.5)? "W":(deg > 22.5 && deg < 67.5)? "NE":(deg > 112.5 && deg < 157.5)? "SE":(deg > 202.5 && deg < 247.5)? "SW":(deg > 292.5 && deg < 337.5)?"NW":"--";

    texts[0].innerHTML = `${humidity} %`;
    texts[1].innerHTML = `${visibility} m`;
    texts[2].innerHTML = `${windspeed} km/h | ${degConverted}`;
    texts[3].innerHTML = `${pressure} hPa`;

    //Messages 
    let message1 = (humidity < 30)? "The air is dry today, so remember to keep well hydrated!":(humidity >= 30 && humidity <= 60)? "Nothing in particular to report.":"Stay cool if you don't want to sweat too much.";
    let message2 = (visibility > 5000)? "Visibility is excellent, so you should have a good view.":(visibility >= 1000 && visibility <= 5000)? "Visibility is reduced, so take care on the road.":"There is a thick fog. Avoid driving if possible.";
    let message3 = (windspeed < 3.6)? "The wind is calm today.":(windspeed >= 3.6 && windspeed <= 18)? "Expect a light breeze today.":"Be careful, the wind is strong, so hold on tight to your hats!";
    let message4 = (pressure < 980)? "Be prepared for changes in the weather as the pressure is low!":(pressure >= 980 && pressure <= 1020)? "Atmospheric pressure within normal range.":"Expect calm, stable weather.";

    messages[0].innerHTML = message1;
    messages[1].innerHTML = message2;
    messages[2].innerHTML = message3;
    messages[3].innerHTML = message4;


    //Temp min et max
    let tempmin = object.list[num].main.temp_min;
    let tempmax = object.list[num].main.temp_max;

    tminmax.innerHTML = ` ${tempmin.toFixed(0)}° / ${tempmax.toFixed(0)}° `;

    //Le weather_state
    weatherstate.innerHTML = object.list[num].weather[0].main;
    weatherstate_description.innerHTML = capitalizeFirstLetter(object.list[num].weather[0].description);

    //La date
    date.innerHTML = `${object.list[num].dt_txt[8] + object.list[num].dt_txt[9]} ${months[Number(object.list[num].dt_txt[5] + object.list[num].dt_txt[6]) - 1]} ${object.list[num].dt_txt[0] + object.list[num].dt_txt[1] + object.list[num].dt_txt[2] + object.list[num].dt_txt[3]}`;

    //La weather_image
    weatherimg.setAttribute("src", `media/weatherstate/${(weatherstate.innerHTML).toLowerCase()}.png`);
    document.getElementsByTagName("body")[0].setAttribute("style", `background-image :linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url("media/background/${(weatherstate.innerHTML).toLowerCase()}.jpg"); background-size: cover;`);
}






//A l'entrée dans l'application

if ("geolocation" in navigator) 
{
    // Demande la position géographique de l'utilisateur
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=bc2d8903cfe8e551436f9da1ad74b6d6&units=metric&current_weather=true`)
        .then(response => response.json())
        .then(data => {
            object = JSON.parse(JSON.stringify(data));
            displayValues(object, 0);
        })
        .catch(error => alert("Erreur lors de la requête à l'API OpenWeatherMap:", error));
    }, function(error) {
      // Gestion des erreurs
      alert("Erreur de géolocalisation:", error.message);
    });
} 
else 
{
    // La géolocalisation n'est pas prise en charge par le navigateur
    alert("La géolocalisation n'est pas prise en charge par ce navigateur.");
}





//Lorsqu'on fait une recherche
let city = document.getElementById('city');
let country = document.getElementById("country");

let search = document.getElementById("search");

async function weatherDisplay()
{
    try
    {
        //Obtention du code du pays
        let request1 = await fetch(`https://restcountries.com/v3.1/name/${country.value.toLowerCase()}`);
        let code = await request1.json();
        var countrycode = code[0].cca2;

        //Obtention des informations
        let request2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city.value.toLowerCase()},${countrycode.toLowerCase()}&APPID=bc2d8903cfe8e551436f9da1ad74b6d6&units=metric&current_weather=true`)
        let infos = await request2.json();
        object = JSON.parse(JSON.stringify(infos));

        displayValues(object, 0);
    }
    catch(error)
    {
        alert(error);
    }
}

search.addEventListener("click", function(){
    i = 0;
    weatherDisplay();
});



//Gestion des flèches
let flèches = document.getElementsByClassName("flèches");
//Lorsque la flèche est appuyée, l'image, la température min et max, la date et le jour avec 
//le weather doivent être modifiés. Le jour est modifié à l'extérieur de la fonction displayValues
var i = 0;
flèches[0].addEventListener("click", function(){
    if(i > 0)
    {
        i--;
        day.innerHTML = days[(new Date()).getDay() + i];
        displayValues(object, i*8);
    }
});

flèches[1].addEventListener("click", function (){
    if(i < 4)
    {
        i++;
        day.innerHTML = days[(new Date()).getDay() + i];
        displayValues(object, i*8);
    }
});