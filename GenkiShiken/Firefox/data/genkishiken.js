/*jshint esversion: 6 */
const NUM_OF_LESSONS = 23;

function listLessons () {
  for (var i = 1; i <= NUM_OF_LESSONS; i++) {
    $("<option>", {
    value: i,
    text: "Lesson " + i
    }).appendTo( "#lesson_select");
  }
  $("option:first").prop("selected",true);
}

$(document).ready(function(){
  listLessons();
});
