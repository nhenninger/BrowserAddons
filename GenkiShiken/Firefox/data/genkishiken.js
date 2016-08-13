/*jshint esversion: 6 */
var numCorrect = 0;
var characterArray;
var answerSuperset;
const NUM_OF_LESSONS = 23;

function listLessons() {
  for (var i = 1; i <= NUM_OF_LESSONS; i++) {
    $("<option>", {
    value: i,
    text: "Lesson " + i
    }).appendTo( "#lesson_select");
  }
  $("option:first").prop("selected", true);
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

function resetQuiz() {
  numCorrect = 0;
  characterArray.memory_card_shuffle();
  // Start quiz from beginning
}

$(document).ready(function(){
  $("#lesson_select").change(loadJSON());
  // https://stackoverflow.com/questions/13152927/how-to-use-radio-on-change-event
  $("input[type=radio][name=lessonFocus]").change(resetQuiz());
  listLessons();
});
