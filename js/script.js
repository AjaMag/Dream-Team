var lat;
var long;
var db = firebase.database();
var favs = db.ref("favorites");
var weather;

$(document).ready(function(){
  $('.parallax').parallax();
});
    

function getLocation() {
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;

  console.log(lat, long)
  var hikingURL = `https://www.hikingproject.com/data/get-trails?maxResults=20&lat=${lat}&lon=${long}&maxDistance=10&key=200356178-455274bda6e2c8c2496858d99e90dcc7`;
  
  setTimeout(function () {
    weatherAPI(lat, long)
  }, 2000)

   $.get(hikingURL)
   .then(function(response) {
     $("#cardholder").empty();
    for (i = 0; i < response.trails.length; i++) {
    $("#cardholder").append(`
    <a class="carousel-item">  
    <div class="card">
      <div class="card-image">
        <img src="${response.trails[i].imgSmallMed}" onerror="this.onerror=null;this.src='img/defaultpic.png'">
        <span class="card-title">${response.trails[i].name}</span>
      </div>
      <div class="card-content">
        <p>${response.trails[i].location}</p>
        <br>
        <p>${response.trails[i].summary}</p>
      </div>
       <div class="card-action">
       <p class="addFavorite" data-id="${response.trails[i].id}">Add to Favorites</p>
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

$(document).on("click", ".addFavorite", function () {

  favs.push($(this).attr("data-id"))
})


  favs.on("child_added", function (favorites) {
    var hikingURL = `https://www.hikingproject.com/data/get-trails-by-id?ids=${favorites.val()}&key=200356178-455274bda6e2c8c2496858d99e90dcc7`;

    $.get(hikingURL)
      .then(function (response) {

        console.log(response)
          $("#favholder").append(`
    <a class="carousel-item">  
    <div class="card">
      <div class="card-image">
        <img src="${response.trails[0].imgSmallMed}" onerror="this.onerror=null;this.src='img/defaultpic.png'">
        <span class="card-title">${response.trails[0].name}</span>
      </div>
      <div class="card-content">
        <p>${response.trails[0].location}</p>
        <br>
        <p>${response.trails[0].summary}</p>
      </div>
       <div class="card-action">
       <p data-id="${response.trails.id}">Favorite!</p>
        </div>
    </div>
    </a>
    `)
  })

    setTimeout(function () {
      $('.carousel').carousel();
      $('.carousel-slider').slider({ full_width: true });
    }, 500)
})

function findLocation () {
  event.preventDefault();
  
  var local = $("#cityName").val();
  $.get(`https://dev.virtualearth.net/REST/v1/Locations/${local}?&maxResults=1&key=Ami0rQuZG9aaTceHF0XA2qTY0BWc1D5gUXmI0R1VJ_URY8sHjBb4ksEK85edNRjY`)
  .then(function (localResponse) {
    console.log(localResponse);
    lat = localResponse.resourceSets[0].resources[0].point.coordinates[0];
    long = localResponse.resourceSets[0].resources[0].point.coordinates[1];
    var hikingURL = `https://www.hikingproject.com/data/get-trails?maxResults=20&lat=${lat}&lon=${long}&maxDistance=10&key=200356178-455274bda6e2c8c2496858d99e90dcc7`;
   
    setTimeout(function () {
      weatherAPI(lat, long)
    }, 2000)
   
    $.get(hikingURL)
    .then(function (response) {
      $("#cardholder").empty();
        for (i = 0; i < response.trails.length; i++) {
          $("#cardholder").append(`
    <a class="carousel-item">  
    <div class="card">
      <div class="card-image">
        <img src="${response.trails[i].imgSmallMed}" >
        <span class="card-title">${response.trails[i].name}</span>
      </div>
      <div class="card-content">
        <p>${response.trails[i].location}</p>
        <br>
        <p>${response.trails[i].summary}</p>
      </div>
       <div class="card-action">
       <p class="addFavorite" data-id="${response.trails[i].id}">Add to Favorites</p>
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
  })











}
//Weather API call
function weatherAPI (lat, long) {

  var queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=30ad9365801925ba6147c686f6736863`

  $.ajax({
    url: queryURL,
    method: "GET"
  })

  .then(function(response) {
  console.log(response)
  weather = response.weather[0].main;
  console.log(weather);
  //weather options - "Clear", "Clouds", "Mist", "Rain", "Haze"
  switch (weather) {
    case "Clear":
      $("#backgroundTop").css("background-image", "url('img/defaultpic.png')")
      break;
    case "Clouds":
      $("#backgroundTop").css("background-image", "url('img/defaultpic.png')")
      break;
    case "Mist":
      $("#backgroundTop").css("background-image", "url('img/defaultpic.png')")
      break; 
    case "Rain":
      $("#backgroundTop").css("background-image", "url('img/defaultpic.png')")
      break;
    case "Haze":
      $("#backgroundTop").css("background-image", "url('img/defaultpic.png')")
      break;
  }
  })
}

