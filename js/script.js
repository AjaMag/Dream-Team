var lat;
var long;

var pArr = ['img/cloudy_day.jpg', 'img/sunny_day.jpg', 'img/rainy day.jpg']
 

$(document).ready(function(){
  $('.parallax').parallax();
});
    

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
    
}
function showPosition(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;
  console.log(lat, long)
  var hikingURL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=200356178-455274bda6e2c8c2496858d99e90dcc7`;
  
   $.get(hikingURL)
   .then(function(response) {
    for (i = 0; i < response.trails.length; i++) {
    $("#cardholder").append(`
    <a class="carousel-item">  
    <div class="card">
      <div class="card-image">
        <img src="${response.trails[i].imgSmallMed}">
        <span class="card-title">${response.trails[i].name}</span>
      </div>
      <div class="card-content">
        <p>${response.trails[i].location}</p>
        <br>
        <p>${response.trails[i].summary}</p>
      </div>
    </div>
    </a>
    `)
    }
     setTimeout(function () {
       $('.carousel').carousel();
       $('.carousel-slider').slider({ full_width: true });
     }, 500)
     console.log(response)
   })
}

//Weather API call
function weatherAPI (position) {

  var queryURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=30ad9365801925ba6147c686f6736863`

  $.ajax({
    url: queryURL,
    method: "GET"
  })

  .then(function(response) {
  console.log(response)
  var results = response.data;
  })
}

getLocation()
setTimeout(function (){
  weatherAPI()
},4000)