// var lessonNum = 1;
// var currCardSet = []; // A random subset from the lesson file
// var currBoard = []; // Twice size of currCardSet, objects have 3 parts: part1, part2, display
// var boardDimension = 4; // TODO: add a listener to update this

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
function newBoard(){
  tiles_flipped = 0;
  memory_array.memory_tile_shuffle();
  for(var i = 0; i < memory_array.length; i++){
    var card = document.createElement("div");
    card.setAttribute('id', 'tile_' + i);
    card.setAttribute('onclick', 'memoryFlipTile(this,\'' + memory_array[i] + '\');');
    card.setAttribute('class', 'unflipped_card');
    document.getElementById('memory_board').appendChild(card);
  }
}
function memoryFlipTile(tile,val){
  if(tile.childNodes.length === 0 && memory_values.length < 2){
    tile.setAttribute("class", "flipped_card");
    tile.appendChild(document.createTextNode(val));
    if(memory_values.length == 0){
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
        if(tiles_flipped == memory_array.length){
          alert("Board cleared... generating new board");
          var board = document.getElementById('memory_board');
          while (board.hasChildNodes()) {
            board.removeChild(board.firstChild);
          }
          newBoard();
        }
      } else {
        function flip2Back(){
            // Flip the 2 tiles back over
            var tile_1 = document.getElementById(memory_tile_ids[0]);
            var tile_2 = document.getElementById(memory_tile_ids[1]);
            tile_1.setAttribute('class', 'unflipped_card');
            while (tile_1.hasChildNodes()) {
              tile_1.removeChild(tile_1.firstChild);
            }
            tile_2.setAttribute('class', 'unflipped_card');
            while (tile_2.hasChildNodes()) {
                tile_2.removeChild(tile_2.firstChild);
            }
            // Clear both arrays
            memory_values = [];
            memory_tile_ids = [];
        }
        setTimeout(flip2Back, 700);
      }
    }
  }
}