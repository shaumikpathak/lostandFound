"use strict";

load();
function load() {
  let loc = window.sessionStorage.getItem("locationS");
  let dateTo = window.sessionStorage.getItem("dateTo");
  let dateFrom = window.sessionStorage.getItem("dateFrom");
  let timeFrom = window.sessionStorage.getItem("timeFrom");
  let timeTo = window.sessionStorage.getItem("timeTo");
  let cat = window.sessionStorage.getItem("categoryS");
  let title = window.sessionStorage.getItem("title");

  //document.getElementById("1").innerText = cat;
  
  let info = {
    //location: loc,
    dateTo: dateTo,
    dateFrom: dateFrom,
    timeFrom: timeFrom,
    timeTo: timeTo,
    category: cat,
    title: title
  };

  var xmlhttp = new XMLHttpRequest();

  console.log(info);
  xmlhttp.open("POST", "/search");
  // important to set this for body-parser
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // setup callback function
  
  xmlhttp.onloadend = function(e) {
   
    let data = JSON.parse("[" + xmlhttp.responseText + "]");
    console.log(data);
    var coll = document.getElementsByClassName("collapsible2");
  var i;
  // if (data){
  //   
  // }
  for (i = 0; i < coll.length; i++) {
    coll[i].innerText = data[i].title;
    console.log("This is the title"+data[i].title);
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
  };
  // all set up!  Send off the HTTP request
  // important to set this for body-parser  
  
  
    
    //console.log(data);
  // setup callback function  
  
  
  xmlhttp.send(JSON.stringify(info));
  //send request to server here
}



