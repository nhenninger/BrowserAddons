function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function extractMeanings(jsonObject) {
  var tuc = jsonObject["tuc"];
  var rval = [];
  for (i = 0; i < tuc.length; i++) {
    if (tuc[i].meanings) {
      for (j = 0; j < tuc[i].meanings.length; j++) {
        var newDefinition = tuc[i].meanings[j].text.toString();
        if (typeof(newDefinition) === "string") {
          rval.push(unescapeHTML(newDefinition));
        }
      }
    }
    if (tuc[i].phrase) {
      var newDefinition = tuc[i].phrase.text.toString();
      if (typeof(newDefinition) === "string") {
        rval.push(unescapeHTML(newDefinition));
      }
    }
  }
  return rval;
}

function makePretty(meaningsArray) {
  var newDiv = document.createElement("div");
  var newHeading = document.createElement("h3");
  var newHeaderText = document.createTextNode(query);
  newHeading.appendChild(newHeaderText);
  newDiv.appendChild(newHeading);
  if (meaningsArray.length > 0) {
    var newUL = document.createElement("ul");
    for (k = 0; k < meaningsArray.length; k++) {
      var newLI = document.createElement("li");
      var newDefNode = document.createTextNode(meaningsArray[k]);
      newLI.appendChild(newDefNode);
      newUL.appendChild(newLI);
    }
    newDiv.appendChild(newUL);
  } else {
    var newParagraph = document.createElement("p");
    var newText = document.createTextNode("No definitions could be retrieved.");
    newParagraph.appendChild(newText);
    newDiv.appendChild(newParagraph);
  }
  var currentDiv = document.getElementById("display"); 
  document.body.insertBefore(newDiv, currentDiv); 
}

// https://stackoverflow.com/questions/22279231/using-js-jquery-how-can-i-unescape-html-and-put-quotes-back-in-the-str
function unescapeHTML(str) {
    return str
         .replace(/&amp;/g, "&")
         .replace(/&lt;/g, "<")
         .replace(/&gt;/g, ">")
         .replace(/&quot;/g, "\"")
         .replace(/&lsquo;/g, "\‘")
         .replace(/&rsquo;/g, "\’")
         .replace(/&ldquo;/g, "\“")
         .replace(/&rdquo;/g, "\”")
         .replace(/&#39;/g, "\'")
         .replace(/&#039;/g, "\'");
 }

// Execution starts here
var query = getParameterByName("query");
var url = "https://glosbe.com/gapi/translate?from=jpn&dest=eng&format=json&phrase=" + query;
var request = new XMLHttpRequest();

request.open("GET", url, true);
request.onload = function () {
  var jsonResponse = JSON.parse(request.responseText);
  var meaningsArray = extractMeanings(jsonResponse);
  makePretty(meaningsArray);
};
request.send();