/*function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var query = getParameterByName('query');

//console.log(query);

var url = "http://nihongo.monash.edu/cgi-bin/wwwjdic?1ZUJ" + query;

console.log(url);

//console.log("Now preparing the request, Captain.");
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.onload = function () {
  //var jsonResponse = JSON.parse(request.responseText);
  //var summary = parse(jsonResponse);
  //var element = document.getElementById("display");
  document.write(request.responseText);
  //console.log(element.textContent + " Just set the textContent: " + summary);
};
request.send(); */