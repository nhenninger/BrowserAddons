/*jshint esversion: 6 */
var numCorrect = 0;
var characterArray = [];
var answerSuperset = [];
const NUM_OF_LESSONS = 23;

function LessonException(message) {
   this.message = message;
   this.name = "LessonException";
}

function displayQuestions() {
  numCorrect = 0;
  $("#exam").empty();
  characterArray.shuffle();

}

function loadJSON() {
  var lessonNum = $("#lesson_select").val();
  $.ajax({
    type: "GET",
    beforeSend: function(xhr) { // https://stackoverflow.com/questions/2618959/not-well-formed-warning-when-loading-client-side-json-in-firefox-via-jquery-aj
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType("application/json");
      }
    },
    dataType: "json",
    url: "lessons/lesson" + lessonNum + ".json",  // TODO: change folder back to symlink before publishing
    success: function (response) {
      if (lessonNum > 2) {
        characterArray = response.kanji;
      } else if (lessonNum > 0) {
        characterArray = response.syllabary;
      } else {
        throw new LessonException("InvalidLessonNumber");
      }
      // console.log(JSON.stringify(characterArray));
      displayQuestions();
    }
  });
}

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
Array.prototype.shuffle = function(){
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

// function resetQuiz() {
//   numCorrect = 0;
//   characterArray.shuffle();
//   // Start quiz from beginning
// }

$(document).ready(function(){
  listLessons();
  $("#lesson_select").change(loadJSON);
  $("input[type=radio][name=lessonFocus]").change(displayQuestions);
  loadJSON();
});
