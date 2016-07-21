// var lessonNum = 1;
currCardSet = []; // A random subset from the lesson file
var currBoard = []; // Twice size of currCardSet
var boardDimension = 4; // TODO: add a listener to update this
var latinTextIsOn = true;

function CardException(message) {
   this.message = message;
   this.name = "CardException";
}
function LessonException(message) {
   this.message = message;
   this.name = "LessonException";
}


// Populate currCardSet[] with random entries from the JSON file
function loadLesson() {
  lessonNum = parseInt(document.getElementById("lesson_select").value);
  var request = new XMLHttpRequest();
  var url = "lesson" + lessonNum + ".json";
  request.open("GET", url, false);
  request.overrideMimeType("application/json");
  request.onload = function () {
    var jsonResponse = JSON.parse(request.responseText);
    if (lessonNum > 2) {
      currCardSet = jsonResponse["kanji"];
    } else if (lessonNum > 0) {
      currCardSet = jsonResponse["syllabary"];
    } else {
      throw new LessonException("InvalidLessonNumber");
    }
    // Duplicates the array
    currCardSet = currCardSet.concat(currCardSet);
    //console.log("currCardSet length before shuffle is " + currCardSet.length);
    currCardSet.memory_tile_shuffle();
    //console.log("currCardSet length after shuffle is " + currCardSet.length);
    // var randomIndices = pickRandomIndices(potentialCards.length);
    // if (potentialCards.length > boardDimension * boardDimension / 2) {
    //   boardDimension = Math.floor(Math.sqrt(potentialCards.length));
    // }
    // for (i = 0; i < boardDimension * boardDimension / 2; i++) {
    //   currCardSet[i] = potentialCards[randomIndices[i]];
    // }
  };
  request.send(null);
}


// function pickRandomIndices(len) {
//   var rval = [];
//   for (i = 0; i < len; i++) {
//     rval[i] = i;
//   }
//   rval.memory_tile_shuffle;
//   return rval;
// }


// Generates an array of the playing cards.  Each card shares part1 and part2
// with another but only displays one or the other.
// function prepCards() {
//   for (i = 0; i < currCardSet.length; i++) {
//     if (currCardSet[i].kana) {
//       currBoard[i].part1 = currCardSet[i].kana;
//       currBoard[i].part2 = currCardSet[i].pronunciation;
//       currBoard[i].display = currBoard[i].part1;
//       currBoard[i + currCardSet.length].part1 = currCardSet[i].kana;
//       currBoard[i + currCardSet.length].part2 = currCardSet[i].pronunciation;
//       currBoard[i + currCardSet.length].display = currBoard[i + currCardSet.length].part2;
//     } else if (currCardSet[i].character) {
//       currBoard[i].part1 = currCardSet[i].character;
//       currBoard[i].part2 = currCardSet[i].meaning;
//       currBoard[i].display = currBoard[i].part1;
//       currBoard[i + currCardSet.length].part1 = currCardSet[i].character;
//       currBoard[i + currCardSet.length].part2 = currCardSet[i].meaning;
//       currBoard[i + currCardSet.length].display = currBoard[i + currCardSet.length].part2;
//     } else {
//       throw new CardException("InvalidCardSet");
//     }
//   }
// }

// https://jsfiddle.net/m1erickson/sAFku/
//https://stackoverflow.com/questions/20060915/javascript-how-do-you-set-the-value-of-a-button-with-an-element-from-an-array
// https://www.youtube.com/watch?v=c_ohDPWmsM0


// Based on the script by Adam Khoury from the video tutorial:
// http://www.youtube.com/watch?v=c_ohDPWmsM0
var memory_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L'];
var memory_values = [];
var memory_tile_ids = [];
var tiles_flipped = 0;


// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
Array.prototype.memory_tile_shuffle = function(){
  var i = this.length, randomIndex, tempVal;
  // While there remain elements to shuffle...
  while (i !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * i);
    i--;
    // And swap it with the current element.
    tempVal = this[i];
    this[i] = this[randomIndex];
    this[randomIndex] = tempVal;
  }
}


function flip2Back(){
  // Flip the 2 tiles back over
  var tile_1 = document.getElementById(memory_tile_ids[0]);
  var tile_2 = document.getElementById(memory_tile_ids[1]);
  if (tile_1) {
    tile_1.setAttribute('class', 'card_front');
    while (tile_1.hasChildNodes()) {
      tile_1.removeChild(tile_1.firstChild);
    }
  }
  if (tile_2) {
    tile_2.setAttribute('class', 'card_front');
    while (tile_2.hasChildNodes()) {
        tile_2.removeChild(tile_2.firstChild);
    }
  }
  // Clear both arrays
  memory_values = [];
  memory_tile_ids = [];
}


function newBoard(){  // TODO: change this and all calls to init()
                      // TODO: add calls to reload from JSON files
                      // TODO: check listener for level selection
                      // TODO: finish creating JSON levels
                      // TODO: Do the funky chicken
                      // TODO: Add card flipping effect
                      // TODO: add support for Anki cards (or some alternative?)
                      // TODO: add support for audio cards?
  var board = document.getElementById('memory_board');
  while (board.hasChildNodes()) {
    board.removeChild(board.firstChild);
  }
  console.log("Board cleared.");
  flip2Back();
  console.log("Cards returned to original positions.");
  loadLesson();
  console.log("Lesson loaded.");
  // prepCards();
  tiles_flipped = 0;
  console.log("Just before loop, currCardSet length is " + currCardSet.length);
  for(var i = 0; i < currCardSet.length; i++){
    //console.log("Creating new divs.  i = " + i);
    var tile = document.createElement("div");
    tile.setAttribute('id', 'tile_' + i);
    tile.setAttribute('onclick', 'memoryFlipTile(this,\'' + displayCardText(currCardSet[i]) + '\');');
    tile.setAttribute('class', 'card_front');
    document.getElementById('memory_board').appendChild(tile);
  }
}

function displayCardText(card) {
  //console.log("Now creating card display text.");
  if (card.kana) {
    return card.kana
           + ''
           + card.pronunciation;
  } else if (card.character) {
    return card.character
           + ''
           + card.meaning;
  } else {
    console.log("cardException displaying card text");
    throw new CardException("InvalidCardSet");
  }
}


function memoryFlipTile(tile,val){
  if(tile.childNodes.length === 0 && memory_values.length < 2){
    tile.setAttribute("class", "card_back");
    tile.appendChild(document.createTextNode(val[0]));
    tile.appendChild(document.createElement("br"));
    var latin_div = document.createElement("div");
    latin_div.appendChild(document.createTextNode(val.substring(1,val.length)));
    latin_div.setAttribute('class', 'latin_text');
    tile.appendChild(latin_div);
    if(memory_values.length === 0){
      memory_values.push(val);
      memory_tile_ids.push(tile.id);
    } else if(memory_values.length == 1){
      memory_values.push(val);
      memory_tile_ids.push(tile.id);
      if(memory_values[0] == memory_values[1]){
        tiles_flipped += 2;
        // Clear both arrays
        memory_values = [];
        memory_tile_ids = [];
        // Check to see if the whole board is cleared
        if(tiles_flipped == currCardSet.length){
          alert("Board cleared... generating new board");
          newBoard();
        }
      } else {
        setTimeout(flip2Back, 700);
      }
    }
  }
}

function toggleLatinText() {
  var latin_div_array = document.getElementsByClassName("latin_text");
  for (i = 0; i < latin_div_array.length; i++) {
    if (window.getComputedStyle(latin_div_array[i], null).getPropertyValue("display") === "block") {
      latin_div_array[i].style.display = "none";
    } else {
      latin_div_array[i].style.display = "block";
    }
  }
}
