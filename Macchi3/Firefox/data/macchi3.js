/*jshint esversion: 6 */
var colorGroupIsOn;
const NUM_OF_LESSONS = 23;

function QuestionException(message) {
   this.message = message;
   this.name = "QuestionException";
}
function LessonException(message) {
   this.message = message;
   this.name = "LessonException";
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(arr){
  var currentIndex = arr.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
}

function chooseYomi() {
  return Math.random() <= 0.5 ? "on_yomi" : "kun_yomi";
}

/**
 *  Loads the selected lesson JSON file and populates the characterArray.
 */
 // TODO: change from memory game
function loadJSON(callback) {
  lessonNum = parseInt(document.getElementById("lesson_select").value);
  var request = new XMLHttpRequest();
  var url = "lessons/lesson" + lessonNum + ".json";
  request.overrideMimeType("application/json");
  request.open("GET", url, true);
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == "200") {
      // .open will NOT return a value but simply returns undefined in async mode so use a callback
      callback(request.responseText);
    }
  };
  request.send(null);
}

// callback function for loadJSON()
// TODO: change from memory game
function loadLesson(response) {
  var jsonResponse = JSON.parse(response);
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
  displayCards();
}

function listLessons() {
  var lesson_dropdown = document.getElementById("lesson_select");
  for (let i = 1; i <= NUM_OF_LESSONS; i++) {
    var newOption = document.createElement("option");
    if (i == 1) {
      newOption.setAttribute("selected", "selected");
    }
    newOption.setAttribute("value", i);
    newOption.appendChild(document.createTextNode("Lesson " + i));
    lesson_dropdown.appendChild(newOption);
  }
}

window.onload = function() {
  listLessons();
  document.getElementById("lesson_select").addEventListener("change", function () {loadJSON(loadLesson);});
  document.getElementById("toggleColorHintCheck").addEventListener("change", function () {loadJSON(loadLesson);});
  loadJSON(loadLesson);
};
