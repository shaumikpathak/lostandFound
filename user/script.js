"use strict";

function onSignIn(googleUser)
{
//        console.log('Username is: '+JSON.stringify(googleUser.getBasicProfile()));
  // Useful data for your client-side scripts:
    
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
}

const uploadImg = document.getElementById("foundImage");
if (uploadImg){
  uploadImg.addEventListener("change", uploadImage);
}

function uploadImage(){
  
    // get the file with the file dialog box
    const selectedFile = document.querySelector('#foundImage').files[0];
    // store it in a FormData object
    const formData = new FormData();
    formData.append('newImage',selectedFile, selectedFile.name);
    let filename = selectedFile.name;
    let button = document.querySelector('.imageBton');

    // build an HTTP request data structure
    const xhr = new XMLHttpRequest();
  
    xhr.open("POST", "/upload", true);
    xhr.onloadend = function(e) {
        // Get the server's response to the upload
        console.log(xhr.responseText);
        
        let newImage = document.querySelector("#cardImg");
        newImage.src = '/images/'+filename;
        //newImage.style.display = 'block';
        //document.querySelector('.image').classList.remove('upload');
        //button.textContent = 'Replace Image';
    }
    //button.textContent = 'Uploading...';
    // actually send the request
    xhr.send(formData);
}








// Create the script tag, set the appropriate attributes
var map, marker;

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCcUxwzJYc6dqNLXIlq3g_duO7zT6t3JlQ&callback=initMap';
script.defer = true;
script.async = true;
var google;
// Attach your callback function to the `window` object
window.initMap = function() {
  // JS API is loaded and available
  map = new google.maps.Map(document.getElementById("googleMap"), {
    center: { lat: 38.5382322, lng: -121.7639012 },
    zoom: 15
  });
  
  marker=new google.maps.Marker();
  marker.setPosition(map.center);
  marker.setDraggable(true);
  marker.setMap(map);
  
  marker.addListener('dragend', function() {
    map.setCenter(marker.getPosition());
    let url = "/getAddress?lat=" + marker.getPosition().lat() + "&lng=" + marker.getPosition().lng();
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
      document.getElementById('search-input').value = data.results[0].formatted_address;
    })
  });
};

function searchLocation() {
  let url = "/searchAddress?input=" + document.getElementById('locationS').value + ",Davis";
  fetch(url)
  .then(res=>res.json())
  .then(data=>{
    console.log(data);
    document.getElementById('locationS').value = data.candidates[0].name + ", " + data.candidates[0].formatted_address;
    marker.setPosition(data.candidates[0].geometry.location);
    map.setCenter(data.candidates[0].geometry.location);
  })
}
// Append the 'script' element to 'head'
document.head.appendChild(script);

const nextButton = document.getElementById("next");
if (nextButton){
  nextButton.addEventListener("click", storeInfo);
}

function storeInfo(){
//   let xhr = new XMLHttpRequest;
//   // it's a GET request, it goes to URL /seneUploadToAPI
//   xhr.open("GET","/sendUploadToAPI");
  
//   // Add an event listener for when the HTTP response is loaded
//   xhr.addEventListener("load", function() {
//       if (xhr.status == 200) {  // success
//         console.log("Success");
//       } else { // failure
//           console.log("failure");
//       }
//   });
//   // Actually send request to server
//   xhr.send();
  let title = document.getElementById('title').value;
  let cat = document.getElementById('category').value;
  let des = document.getElementById('description').value;
  let img = document.getElementById('cardImg').src;
 
  sessionStorage.setItem("title", title);
  sessionStorage.setItem("category", cat);
  sessionStorage.setItem("description", des);
  sessionStorage.setItem("image", img);
  //window.location.href = 'screen4.html';
  //window.location = "https://final-loving-guava.glitch.me/user/screen4.html";
}




// var n=document.getElementById("next");
// n.addEventListener("click", newPage4);

// function newPage4()
// {
//   window.location="https://final-loving-guava.glitch.me/user/screen4.html";
// }
const submitButton = document.getElementById("submit");
if (submitButton){
  submitButton.addEventListener("click", sendInfo);
}

function sendInfo(){
  let date = document.querySelector('#date');
  let time = document.querySelector('#time');
  let loc = document.querySelector('#location');
  let title = sessionStorage.getItem("title");
  let category = sessionStorage.getItem("category");
  let des = sessionStorage.getItem("description");
  //let title = sessionStorage.getItem("title");
  let img = sessionStorage.getItem("image");
  
  let data = {
    title: title,
    category: category,
    description: des,
    image: img,
    date: date.value,
    time: time.value,
    location: loc.value
  }
  let x = JSON.stringify(data);
  console.log("data is: "+ data);
  
  // new HttpRequest instance 
  var xmlhttp = new XMLHttpRequest();   
  
  
  xmlhttp.open("POST", '/found');
  // important to set this for body-parser
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // setup callback function
  xmlhttp.onloadend = function(e) {
    console.log(xmlhttp.responseText);
    //let data=JSON.parse(xmlhttp.responseText);
    
    //let titleResult=document.getElementById("title");
    //titleResult.innerText=data.title;
    //let categoryResult=document.getElementById("category");
    //categoryResult.innerText=data.category;
    //let locationResult=document.getElementById("location");
    //locationResult.innerText=data.location;
    //let dateResult=document.getElementById("date");
    //dateResult.date=data.date;
    //let descriptionResult=document.getElementById("description");
    //descriptionResult.innerText=document.getElementById("description");
  }
  // all set up!  Send off the HTTP request
  xmlhttp.send(JSON.stringify(data));
}

// ############################# Seeker Part Below ####################################

const next2Button = document.getElementById("next2");
if (next2Button){
  next2Button.addEventListener("click", storeInfo2);
}

function storeInfo2(){
  let title2 = document.getElementById('title2').value;
  let cat2 = document.getElementById('category2').value;
  let des2 = document.getElementById('description2').value;
  let img2 = document.getElementById('cardImg').src;
  
  sessionStorage.setItem("title2", title2);
  sessionStorage.setItem("category2", cat2);
  sessionStorage.setItem("description2", des2);
  sessionStorage.setItem("image2", img2);  
}

const submit2Button = document.getElementById("submit2");
if (submit2Button){
  submit2Button.addEventListener("click", sendInfo2);
}
function sendInfo2(){
  let date2 = document.querySelector('#date2');
  let time2 = document.querySelector('#time2');
  let loc2 = document.querySelector('#location2');
  let title2 = sessionStorage.getItem("title2");
  let category2 = sessionStorage.getItem("category2");
  let des2 = sessionStorage.getItem("description2");
  let img2 = sessionStorage.getItem("image2");
  
  let data = {
    title: title2,
    category: category2,
    description: des2,
    image: img2,
    date: date2.value,
    time: time2.value,
    location: loc2.value, 
  }
  
  console.log(data);
  
  // new HttpRequest instance 
  var xmlhttp = new XMLHttpRequest();   
  
  
  xmlhttp.open("POST", '/lost');
  
  //xmlhttp.open("POST", '/search');
  
  // important to set this for body-parser
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // setup callback function
  xmlhttp.onloadend = function(e) {
    console.log(xmlhttp.responseText);
  }
  // all set up!  Send off the HTTP request
  xmlhttp.send(JSON.stringify(data));
}


//Step 3 for UCD Lost and Found


const searchButton = document.getElementById("searchButton");
if (searchButton){
  searchButton.addEventListener("click", storeData);
}

function storeData() {
  let title = document.getElementById("search").value;
  let loc = document.getElementById("locationS").value;
  let dateTo = document.getElementById("dateto").value;
  let dateFrom = document.getElementById("datefr").value;
  let timeFrom = document.getElementById("timefr").value;
  let timeTo = document.getElementById("timeto").value;
  let cat = document.getElementById("categoryS").value;
  
  window.sessionStorage.setItem('locationS', loc);
  window.sessionStorage.setItem('dateFrom', dateFrom);
  window.sessionStorage.setItem('dateTo', dateTo);
  window.sessionStorage.setItem('timeTo', timeTo);
  window.sessionStorage.setItem('timeFrom', timeFrom);
  window.sessionStorage.setItem('categoryS', cat);
  window.sessionStorage.setItem('title', title);
  
  //window.location = "https://final-loving-guava.glitch.me/user/screen10.html";
}


