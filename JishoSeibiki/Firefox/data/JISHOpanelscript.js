function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function extractMeanings(jsonObject) {
  var data = jsonObject["data"];
  var rval = [];
  for (h = 0; h < data.length; h++) {
    var newDefinition = {};
    if (data[h].japanese) {
      newDefinition.japaneseArray = [];
      for (i = 0; i < data[h].japanese.length; i++) {
        var newJPObject = {};
        newJPObject.word = data[h].japanese[i].word.toString();
        newJPObject.reading = data[h].japanese[i].reading.toString();
        newDefinition.japaneseArray.push(newJPObject);
      }
    }
    newDefinition.meanings = [];
    for (j = 0; j < data[h].senses.length; j++) {
      if (data[h].senses[j].english_definitions) {
        for (k = 0; k < data[h].senses[j].english_definitions.length; k++) {
          newDefinition.meanings.push(data[h].senses[j].english_definitions[k].toString());
        }
      }
    }
    rval.push(newDefinition);
  }
  return rval;
}

function makePretty(meaningsArray) {
  var newDiv = document.createElement("div");
  var newHeading = document.createElement("h3");
  var newHeaderText = document.createTextNode(query);
  newHeading.appendChild(newHeaderText);
  newDiv.appendChild(newHeading);
  var newTable = document.createElement("table");
  var newTableRow = document.createElement("tr");
  var newTableHeading = document.createElement("th");
  newTableHeading.appendChild(document.createTextNode("Word & Reading"));
  newTableRow.appendChild(newTableHeading);
  var newTableHeading = document.createElement("th");
  newTableHeading.appendChild(document.createTextNode("English Definitions"));
  newTableRow.appendChild(newTableHeading);
  
  if (meaningsArray.length > 0) {
    for (x = 0; x < meaningsArray.length; x++) {
      var newTableRow = document.createElement("tr");


      var newTableData = document.createElement("td");
      if (meaningsArray[x].japaneseArray) {
        var newUL = document.createElement("ul");
        for (y = 0; y < meaningsArray[x].japaneseArray.length; y++) {
          var newLI = document.createElement("li");
          newLI.appendChild(document.createTextNode(meaningsArray[x].japaneseArray[y].word
                                                    + "\t\t"
                                                    + meaningsArray[x].japaneseArray[y].reading));
          newUL.appendChild(newLI);
        }
        newTableData.appendChild(newUL);
      } else {
        newTableData.appendChild(document.createTextNode("N/A"));
      }
      newTableRow.appendChild(newTableData);
      newTable.appendChild(newTableRow);

      // var newTableData = document.createElement("td");
      // if (meaningsArray[x].word) {
      //   var newWordNode = document.createTextNode(meaningsArray[x].word);
      // } else {
      //   var newWordNode = document.createTextNode("N/A");
      // }
      // newTableData.appendChild(newWordNode);
      // newTableRow.appendChild(newTableData);


      // var newTableData = document.createElement("td");
      // if (meaningsArray[x].reading) {
      //   var newReadingNode = document.createTextNode(meaningsArray[x].reading);
      // } else {
      //   var newReadingNode = document.createTextNode("N/A");
      // }
      // newTableData.appendChild(newReadingNode);
      // newTableRow.appendChild(newTableData);


      var newTableData = document.createElement("td");
      if (meaningsArray[x].meanings) {
        var newUL = document.createElement("ul");
        for (y = 0; y < meaningsArray[x].meanings.length; y++) {
          var newLI = document.createElement("li");
          var newDefNode = document.createTextNode(meaningsArray[x].meanings[y]);
          newLI.appendChild(newDefNode);
          newUL.appendChild(newLI);
        }
        newTableData.appendChild(newUL);
      } else {
        newTableData.appendChild(document.createTextNode("N/A"));
      }
      newTableRow.appendChild(newTableData);
      newTable.appendChild(newTableRow);
    }
    newDiv.appendChild(newTable);
  } else {
    var newParagraph = document.createElement("p");
    newParagraph.appendChild(document.createTextNode("No definitions could be retrieved."));
    newDiv.appendChild(newParagraph);
  }
  var currentDiv = document.getElementById("display"); 
  document.body.insertBefore(newDiv, currentDiv); 
}

function decodeEntities(encodedString) {
    var textArea = document.createElement("textarea");
    textArea.innerHTML = encodedString;
    return textArea.value;
}

var query = getParameterByName("query");
var url = "http://jisho.org/api/v1/search/words?keyword=" + query;
var request = new XMLHttpRequest();

request.open("GET", url, true);
request.onload = function () {
  var jsonResponse = JSON.parse(request.responseText);
  var meaningsArray = extractMeanings(jsonResponse);
  makePretty(meaningsArray);
};
request.send();