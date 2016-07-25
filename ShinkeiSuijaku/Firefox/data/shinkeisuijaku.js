// var lessonNum = 1;
currCardSet = []; // A random subset from the lesson file
var currBoard = []; // Twice size of currCardSet
var boardDimension = 4; // TODO: add a listener to update this
var latinTextIsOn;

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
      currCardSet = jsonResponse.kanji;
    } else if (lessonNum > 0) {
      currCardSet = jsonResponse.syllabary;
    } else {
      throw new LessonException("InvalidLessonNumber");
    }
    // Duplicates the array
    currCardSet = currCardSet.concat(currCardSet);
    //console.log("currCardSet length before shuffle is " + currCardSet.length);
    currCardSet.memory_card_shuffle();
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
//   rval.memory_card_shuffle;
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
var memory_card_ids = [];
var cards_flipped = 0;


// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
Array.prototype.memory_card_shuffle = function(){
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
};


function flip2Back(){
  // Flip the 2 cards back over
  var card_1 = document.getElementById(memory_card_ids[0]);
  var card_2 = document.getElementById(memory_card_ids[1]);
  if (card_1) {
    setFlipped(card_1);
  }
  if (card_2) {
    setFlipped(card_2);
  }
  // Clear both arrays
  memory_values = [];
  memory_card_ids = [];
}


function init() {     // TODO: add calls to reload from JSON files
                      // TODO: check listener for level selection
                      // TODO: finish creating JSON levels
                      // TODO: Do the funky chicken
                      // TODO: Add card flipping effect
                      // TODO: add support for Anki cards (or some alternative?)
                      // TODO: add support for audio cards?
                      // TODO: move card creation logic from memoryFlipcard() to init();
                      // TODO: Add reset button
                      // TODO: Add toggle for flip animation
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
  latinTextIsOn = document.getElementById("toggleLatinTextCheck").checked;
  cards_flipped = 0;
  // animateFlipInit();
  //console.log("Just before loop, currCardSet length is " + currCardSet.length);
  for(var i = 0; i < currCardSet.length; i++){
    //console.log("Creating new divs.  i = " + i);
    var card = document.createElement("div");
    card.setAttribute('id', 'card_' + i);
    card.setAttribute('class', 'card');
    var card_text = displayCardText(currCardSet[i]);
    card.setAttribute('onclick', 'memoryFlipCard(this,\'' + card_text + '\');');
    //card.setAttribute('class', 'card_front');
    var card_container = document.createElement("div");
    card_container.setAttribute('class', 'card_container');
    var card_front = document.createElement("div");
    card_front.setAttribute('class', 'card_front');
    card_front.appendChild(document.createTextNode("foobs"));
    var card_back = document.createElement("div");
    card_back.setAttribute('class', 'card_back');
    card_back.appendChild(document.createTextNode(card_text[0]));
    card_back.appendChild(document.createElement("br"));
    var card_back_latin = document.createElement("div");
    card_back_latin.setAttribute('class', 'latin_text');
    card_back_latin.appendChild(document.createTextNode(card_text.substring(1,card_text.length)));
    if (!latinTextIsOn) {
      card_back_latin.style.visibility = "hidden";
    }
    card_back.appendChild(card_back_latin);
    card_container.appendChild(card_front);
    card_container.appendChild(card_back);
    card.appendChild(card_container);
    document.getElementById('memory_board').appendChild(card);
  }
}

function displayCardText(card) {
  //console.log("Now creating card display text.");
  if (card.kana) {
    return card.kana +
           '' +
           card.pronunciation;
  } else if (card.character) {
    return card.character +
           '' +
           card.meaning;
  } else {
    console.log("cardException displaying card text");
    throw new CardException("InvalidCardSet");
  }
}


function memoryFlipCard(card,val){
  // animateFlip(card);
  if(!isFlipped(card) && memory_values.length < 2){
    setFlipped(card);
    // card.setAttribute("class", "card_back");
    // card.appendChild(document.createTextNode(val[0]));
    // card.appendChild(document.createElement("br"));
    // var latin_div = document.createElement("div");
    // latin_div.appendChild(document.createTextNode(val.substring(1,val.length)));
    // latin_div.setAttribute('class', 'latin_text');
    // if (!latinTextIsOn) {
    //   latin_div.style.display = "none";
    // }
    // card.appendChild(latin_div);
    if(memory_values.length === 0){
      memory_values.push(val);
      memory_card_ids.push(card.id);
    } else if(memory_values.length == 1){
      memory_values.push(val);
      memory_card_ids.push(card.id);
      if(memory_values[0] == memory_values[1]){
        cards_flipped += 2;
        // Clear both arrays
        memory_values = [];
        memory_card_ids = [];
        // Check to see if the whole board is cleared
        if(cards_flipped == currCardSet.length){
          alert("Board cleared... generating new board");
          init();
        }
      } else {
        setTimeout(flip2Back, 700);
      }
    }
  }
}

function toggleLatinText() {
  latinTextIsOn = !latinTextIsOn;
  var latin_div_array = document.getElementsByClassName("latin_text");
  for (i = 0; i < latin_div_array.length; i++) {
    if (window.getComputedStyle(latin_div_array[i], null).getPropertyValue("visibility") === "visible") {
      latin_div_array[i].style.visibility = "hidden";
    } else {
      latin_div_array[i].style.visibility = "visible";
    }
  }
}

// http://callmenick.com/post/css-transitions-transforms-animations-flipping-card
function animateFlipInit() {
  var cards = document.querySelectorAll(".card");
  for ( var i  = 0, len = cards.length; i < len; i++ ) {
    var card = cards[i];
    clickListener( card );
  }
  }

function isFlipped(card) {
    // var c = card.classList;
    if (card.classList.contains("flipped")) {
      // c.remove("flipped");
      return true;
    } else {
      // c.add("flipped");
      return false;
    }
  }

  function setFlipped(card){
    if (isFlipped(card)) {
      card.classList.remove("flipped");
    } else {
      card.classList.add("flipped");
    }
  }

window.onload = function() {
    document.getElementById('lesson_select').onchange = init;
    document.getElementById('toggleLatinTextCheck').onchange = toggleLatinText;
    init();
};
