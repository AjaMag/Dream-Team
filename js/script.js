var lat;
var long;
var db = firebase.database();
var users = db.ref("users");
var weather;
var user;

//this is for the login pop-up window
$(document).ready(function()
{
  user = localStorage.username.toLowerCase() + localStorage.pass.toLowerCase();
  console.log(localStorage.username);
  if (localStorage.username !== "") {
    $("#userBtn").html(`Welcome ${localStorage.username}!`);
    $("#openLogin").attr("onclick", "");
  }
  setTimeout( getFavorites, 500 );
  
 $("#show_login").click(function(){
  showpopup();
 });
 $("#close_login").click(function(){
  hidepopup();
 });
});

function loginPopUp() {
  document.getElementById('modalWrap').style.display='block'
}

function signOut() {
  localStorage.removeItem("username");
  localStorage.removeItem("pass");
  $("#userBtn").html(`Login`);
  $("#openLogin").attr("onclick", "document.getElementById('modalWrap').style.display = 'block'");
  $("#favholder").empty();
}


function setLogin () {
  event.preventDefault();
  localStorage.setItem("username", $("#uName").val())
  localStorage.setItem("pass", $("#pswd").val())
  user = localStorage.username.toLowerCase() + localStorage.pass.toLowerCase();
  document.getElementById('modalWrap').style.display = 'none';
  $("#userBtn").html(`Welcome ${localStorage.username}!`);
  $("#openLogin").attr("onclick", "");
  getFavorites()
}

//this is for the Mobile-Responsive Hamburger Nav Menu
$(document).ready(function(){
  $('.sidenav').sidenav();
});  
function hidepopup()
{
 $("#loginform").fadeOut();
 $("#loginform").css({"visibility":"hidden","display":"none"});
}
//Pop-up login window
//If the user clicks anywhere outside of the login modal, it will close
// var modal = document.getElementById('modalWrap');
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none"
//   }
// }

//this is for the parallax, which displays today's current weather pic using a key word from the weather API
var pArr = ['img/cloudy_day.jpg', 'img/sunny_day.jpg', 'img/rainy day.jpg']
 
$(document).ready(function(){
  $('.parallax').parallax();
});
//parallax    

function getLocation() {
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

//Checking if favRow is empty
window.onload = function () {
  if ( $.trim( $('#favholder').text() ).length == 0 ) {
    console.log("heloo0pooodsafuh")
    $('.carouselHidden').css("display", "none")
    // check if div is empty, with &amp;nbsp; or white-space
  }
}

function showPosition(position) {
  
  lat = position.coords.latitude;
  long = position.coords.longitude;

  console.log(lat, long)
  var hikingURL = `https://www.hikingproject.com/data/get-trails?maxResults=20&lat=${lat}&lon=${long}&maxDistance=10&key=200356178-455274bda6e2c8c2496858d99e90dcc7`;
  

  weatherAPI(lat, long)
  

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
       <button href="#" class="addFavorite" data-id="${response.trails[i].id}">Add to Favorites<i class="material-icons right">thumb_up</i></button>
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

//addFavorite
$(document).on("click", ".addFavorite", function () {
  user =  localStorage.username.toLowerCase() + localStorage.pass.toLowerCase();
  console.log(user)
  firebase.database().ref('users/' + user + '/favorites').push($(this).attr("data-id"));
})

function getFavorites() {
  firebase.database().ref('users/' + user + '/favorites').on("child_added", function (fav) {

    var hikingURL = `https://www.hikingproject.com/data/get-trails-by-id?ids=${fav.val()}&key=200356178-455274bda6e2c8c2496858d99e90dcc7`;

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
  weatherAPI(lat, long)
    setTimeout(function () {
      $('#favholder').carousel();
      $('.carousel-slider').slider({ full_width: true });
    }, 500)
})
}

function findLocation () {
  event.preventDefault();
  
  var local = $("#cityName").val();
  $.get(`https://dev.virtualearth.net/REST/v1/Locations/${local}?&maxResults=1&key=Ami0rQuZG9aaTceHF0XA2qTY0BWc1D5gUXmI0R1VJ_URY8sHjBb4ksEK85edNRjY`)
  .then(function (localResponse) {
    console.log(localResponse);
    lat = localResponse.resourceSets[0].resources[0].point.coordinates[0];
    long = localResponse.resourceSets[0].resources[0].point.coordinates[1];
    var hikingURL = `https://www.hikingproject.com/data/get-trails?maxResults=20&lat=${lat}&lon=${long}&maxDistance=10&key=200356178-455274bda6e2c8c2496858d99e90dcc7`;
   
  
    
    
   
    $.get(hikingURL)
    .then(function (response) {
      $("#cardholder").empty();
        for (i = 0; i < response.trails.length; i++) {
          $("#cardholder").append(`
    <a class="carousel-item">  
    <div class="card">
      <div class="card-image">
        <img src="${response.trails[i].imgSmallMed}" onerror="this.onerror=null;this.src='img/defaultpic.png'">
        <span class="card-title">${response.trails[i].name}</span>
      </div>
      <div class="card-content" class="col-md-11">
        <p>${response.trails[i].location}</p>
        <br>
        <p>${response.trails[i].summary}</p>
      </div>
       <div class="card-action">
       <button href="#" class="addFavorite" data-id="${response.trails[i].id}">Add to Favorites<i class="material-icons right">thumb_up</i></button>
        </div>
    </div>
    </a>
    `)
        }
        weatherAPI(lat, long)
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
  var results = response.data;

//Weather Icon Conditionals
weather = response.weather[0].main;
  
console.log(weather);
//weather options - "Clear", "Clouds", "Mist", "Rain", "Haze"
switch (weather) {
  case "Clear":
  $(".card-content").prepend('<img src="./img/Sunny_icon.png" alt="" class="icon">')
    break;
  case "Clouds":
  $(".card-content").prepend('<img src="./img/cloudy_icon.png" alt="" class="icon">')
    break;
  case "Mist":
  $(".card-content").prepend('<img src="./img/foggy_icon.png" alt="" class="icon">')
    break; 
  case "Rain":
  $(".card-content").prepend('<img src="./img/rainy_icon.png" alt="" class="icon">')
    break;
  case "Haze":
  $(".card-content").prepend('<img src="./img/foggy_icon.png" alt="" class="icon">')
    break;
  case "Thunderstorm":
  $(".card-content").prepend('<img src="./img/thunderstorm_icon.png" alt="" class="icon">')
    break;
    }
  })
}
  

    
    
    
    









