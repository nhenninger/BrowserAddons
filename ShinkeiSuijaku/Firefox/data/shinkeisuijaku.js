var lessonNum = 1;
var currCardSet = []; // A random subset from the lesson file
var currBoard = []; // Twice size of currCardSet, objects have 3 parts: part1, part2, display
var boardDimension = 4; // TODO: add a listener to update this

function CardException(message) {
   this.message = message;
   this.name = "CardException";
}

// Populate currCardSet[] with random entries from the JSON file
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
      currCardSet[i] = potentialCards[randomIndices[i]];
    }
  };
  request.send(null);
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currIndex = array.length, tempVal, randomIndex;
  // While there remain elements to shuffle...
  while (currIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currIndex);
    currIndex--;
    // And swap it with the current element.
    tempVal = array[currIndex];
    array[currIndex] = array[randomIndex];
    array[randomIndex] = tempVal;
  }
  return array;
}

function pickRandomIndices(len) {
  var rval = [];
  for (i = 0; i < len; i++) {
    rval[i] = i;
  }
  rval = shuffle(rval);
  return rval;
}

// Generates a shuffled array of the playing cards.  Each card shares part1 and part2
// with another but only displays one or the other.
function prepCards() {
  for (i = 0; i < currCardSet.length; i++) {
    if (currCardSet[i].kana) {
      currBoard[i].part1 = currCardSet[i].kana;
      currBoard[i].part2 = currCardSet[i].pronunciation;
      currBoard[i].display = currBoard[i].part1;
      currBoard[i + currCardSet.length].part1 = currCardSet[i].kana;
      currBoard[i + currCardSet.length].part2 = currCardSet[i].pronunciation;
      currBoard[i + currCardSet.length].display = currBoard[i + currCardSet.length].part2;
    } else if (currCardSet[i].character) {
      currBoard[i].part1 = currCardSet[i].character;
      currBoard[i].part2 = currCardSet[i].meaning;
      currBoard[i].display = currBoard[i].part1;
      currBoard[i + currCardSet.length].part1 = currCardSet[i].character;
      currBoard[i + currCardSet.length].part2 = currCardSet[i].meaning;
      currBoard[i + currCardSet.length].display = currBoard[i + currCardSet.length].part2;
    } else {
      throw new CardException("InvalidCardSet");
    }
  }
  currBoard = shuffle(currBoard);
}

function drawBoard() {
  var gameboard = document.getElementById("gameboard");
  for (i = 0; i < boardDimension * boardDimension; i++) {
    var newCardDiv = document.createElement("div");
    newCardDiv.setAttribute("id", i);
    newCardDiv.setAttribute("class", "card");
    newCardDiv.setAttribute("onclick", "clickListener(" + i + ");");
    gameboard.appendChild(newCardDiv);
  }
}

function clickListener(selectedCard) {
  for (i = 0; i < boardDimension * boardDimension; i++) {
    if (i == selectedCard) {
      continue;
    }
    if (currBoard[selectedCard].part1 === currBoard[i].part1) {
      // we have a matched pair
    }
  }
}

function playGame() {
  while (true) {

  }
}

// https://jsfiddle.net/m1erickson/sAFku/
//https://stackoverflow.com/questions/20060915/javascript-how-do-you-set-the-value-of-a-button-with-an-element-from-an-array
// https://www.youtube.com/watch?v=c_ohDPWmsM0