var lessonNum = 1;
var currBoard = [];
var currFlippedCard = {};
var boardDimension = 4;

// Populate currBoard[] with random entries from the JSON file
function loadLesson() {
  lessonNum = parseInt(document.getElementById("lesson_select").value);
  var request = new XMLHttpRequest();
  var url = "lesson" + lessonNum + ".json";
  request.open("GET", url, true);
  request.overrideMimeType("application/json");
  request.onload = function () {
    var jsonResponse = JSON.parse(request.responseText);
    if (lessonNum < 3) {
      var potentialCards = jsonResponse["syllabary"];
    } else {
      var potentialCards = jsonResponse["kanji"];
    }
    var randomIndices = pickRandomIndices(potentialCards.length);
    if (potentialCards.length > boardDimension * boardDimension / 2) {
      boardDimension = Math.floor(Math.sqrt(potentialCards.length));
    }
    for (i = 0; i < boardDimension * boardDimension / 2; i++) {
      currBoard[i] = potentialCards[randomIndices[i]];
    }
  };
  request.send(null);
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function pickRandomIndices(len) {
  var rval = [];
  var tempVal, randomIndex;
  var currIndex = len;
  for (i = 0; i < len; i++) {
    rval[i] = i;
  }
  // While there remain elements to shuffle...
  while (currIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currIndex);
    currIndex--;
    // And swap it with the current element.
    tempVal = rval[currIndex];
    rval[currIndex] = rval[randomIndex];
    rval[randomIndex] = tempVal;
  }
  return rval;
}

function drawBoard() {

}

function playGame() {
  while (true) {

  }
}