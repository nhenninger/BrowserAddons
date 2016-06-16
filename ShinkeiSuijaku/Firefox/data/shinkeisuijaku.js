function CardException(message) {
   this.message = message;
   this.name = "CardException";
}

var lessonNum = 1;
var currCardSet = []; // A random subset from the lesson file
var currBoard = []; // Twice size of currCardSet - one for each half of flash card
var boardDimension = 4; // TODO: add a listener to update this

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

function prepCards() {
  var randomCardLocations = [];
  for (i = 0; i < currCardSet.length; i++) {
    if (currCardSet[i].kana) {
      currBoard[i].part1 = currCardSet[i].kana;
      currBoard[i + currCardSet.length].part2 = currCardSet[i].pronunciation;
    } else if (currCardSet[i].character) {
      currBoard[i].part1 = currCardSet[i].character;
      currBoard[i + currCardSet.length].part2 = currCardSet[i].meaning;
    } else {
      throw new CardException("InvalidCardSet");
    }
  }
  currBoard = shuffle(currBoard);
}

function drawBoard() {
  for ()
}

function playGame() {
  while (true) {

  }
}

// https://jsfiddle.net/m1erickson/sAFku/
//https://stackoverflow.com/questions/20060915/javascript-how-do-you-set-the-value-of-a-button-with-an-element-from-an-array