var lat;
var long;

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

getLocation()