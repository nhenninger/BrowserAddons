/*jshint esversion: 6 */
currCardSet = []; // A random subset from the lesson file
var currBoard = []; // Twice size of currCardSet
var boardDimension = 4; // TODO: add a listener to update this
var latinTextIsOn;
var memory_values = [];
var memory_card_ids = [];
var cards_flipped = 0;
const NUM_OF_LESSONS = 23;

function CardException(message) {
   this.message = message;
   this.name = "CardException";
}
function LessonException(message) {
   this.message = message;
   this.name = "LessonException";
}

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

function listLessons() {
  var lesson_dropdown = document.getElementById("lesson_select");
  for (var i = 1; i <= NUM_OF_LESSONS; i++) {
    var newOption = document.createElement("option");
    if (i == 1) {
      newOption.setAttribute("selected", "selected");
    }
    newOption.setAttribute("value", i);
    newOption.appendChild(document.createTextNode("Lesson " + i));
    lesson_dropdown.appendChild(newOption);
  }
}

// Populate currCardSet[] with random entries from the JSON file
function loadLesson() {
  lessonNum = parseInt(document.getElementById("lesson_select").value);
  var request = new XMLHttpRequest();
  var url = "lessons/lesson" + lessonNum + ".json";
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
    currCardSet.memory_card_shuffle();
  };
  request.send(null);
}

function isFlipped(card) {
  if (card.classList.contains("flipped")) {
    return true;
  } else {
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

function displayCardText(card) {
  if (card.kana) {
    return card.kana +
           "" +
           card.pronunciation;
  } else if (card.character) {
    return card.character +
           "" +
           card.meaning;
  } else {
    console.log("cardException displaying card text");
    throw new CardException("InvalidCardSet");
  }
}

function memoryFlipCard(card,val){
  if(!isFlipped(card) && memory_values.length < 2){
    setFlipped(card);
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

// With parts from the script by Adam Khoury from the video tutorial:
// http://www.youtube.com/watch?v=c_ohDPWmsM0
function init() {     // TODO: add support for Anki cards (or some alternative?)
                      // TODO: add support for audio cards?
  var board = document.getElementById("memory_board");
  while (board.hasChildNodes()) {
    board.removeChild(board.firstChild);
  }
  flip2Back();
  loadLesson();
  latinTextIsOn = document.getElementById("toggleLatinTextCheck").checked;
  cards_flipped = 0;
  for(var i = 0; i < currCardSet.length; i++){
    var card = document.createElement("div");
    card.setAttribute("id", "card_" + i);
    card.setAttribute("class", "card");
    var card_text = displayCardText(currCardSet[i]);
    card.setAttribute("onclick", "memoryFlipCard(this,\"" + card_text + "\");");
    var card_container = document.createElement("div");
    card_container.setAttribute("class", "card_container");
    var card_front = document.createElement("div");
    card_front.setAttribute("class", "card_front");
    card_front.appendChild(document.createTextNode("集中"));
    var card_back = document.createElement("div");
    card_back.setAttribute("class", "card_back");
    card_back.appendChild(document.createTextNode(card_text[0]));
    card_back.appendChild(document.createElement("br"));
    var card_back_latin = document.createElement("div");
    card_back_latin.setAttribute("class", "latin_text");
    card_back_latin.appendChild(document.createTextNode(card_text.substring(1,card_text.length)));
    if (!latinTextIsOn) {
      card_back_latin.style.visibility = "hidden";
    }
    card_back.appendChild(card_back_latin);
    card_container.appendChild(card_front);
    card_container.appendChild(card_back);
    card.appendChild(card_container);
    document.getElementById("memory_board").appendChild(card);
  }
}

window.onload = function() {
    document.getElementById("lesson_select").onchange = init;
    document.getElementById("toggleLatinTextCheck").onchange = toggleLatinText;
    listLessons();
    init();
};
