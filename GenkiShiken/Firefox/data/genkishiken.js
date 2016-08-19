/*jshint esversion: 6 */
var numCorrect = 0;
var characterArray = [];
var answerArray = [];
const NUM_OF_LESSONS = 23;
const NUM_OF_MULTI_CHOICE = 5;

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

function createQuestionChoices(typeChoice, questionIndex, indices) {
  for (var k = 0; k < indices.length; k++) {
    // TODO
    $("#question" + questionIndex + " .questionChoices")
      .append(
        $("<li/>")
          .append(
            $("<label/>")
              .append(
                $("<input/>", {
                "type" : "radio",
                "name": "question" + questionIndex,
                "value" : characterArray[indices[k]][typeChoice]})
              )
              .append(characterArray[indices[k]][typeChoice])
          )
      );
  }
}

function chooseYomi() {
  return Math.random() <= 0.5 ? "on_yomi" : "kun_yomi";
}

function createQuestionText(index) {
  var rand;
  var choiceIndices = [];
  choiceIndices[0] = index;
  for (var j = 1; j < NUM_OF_MULTI_CHOICE; j++) {
    do {
      rand = Math.floor(Math.random() * characterArray.length);
    } while (rand == index);
    choiceIndices[j] = rand;
  }
  shuffle(choiceIndices);
  if (characterArray[0].kana) { // Syllabary
    $("input:radio[name=lessonFocus]").attr("disabled", true);
    $("#question" + index + " h1").append(characterArray[index].kana);
    answerArray[index] = characterArray[index].pronunciation;
    createQuestionChoices("pronunciation", index, choiceIndices);
  } else if (characterArray[0].character) { // Kanji
    $("input:radio[name=lessonFocus]").attr("disabled", false);
    $("#question" + index + " h1").append(characterArray[index].character);
    if ($("input:radio[name=lessonFocus]:checked").val() === "meaning") {
      answerArray[index] = characterArray[index].meaning;
      createQuestionChoices("meaning", index, choiceIndices);
    } else if ($("input:radio[name=lessonFocus]:checked").val() === "reading") {
      answerArray[index] = characterArray[index][chooseYomi()];
      createQuestionChoices(chooseYomi(), index, choiceIndices);
    } else {
      console.log("questionException displaying kanjiMeaningOrReading text");
      throw new QuestionException("InvalidMeaningOrReading");
    }
  } else {
    console.log("questionException displaying question text");
    throw new QuestionException("InvalidQuestionSet");
  }
}

function createQuestions() {
  numCorrect = 0;
  var exam = $("#exam_div");
  exam.empty();
  shuffle(characterArray);
  for (var i = 0; i < characterArray.length; i++) {
    exam.append(
      $("<div/>", {"class": "questionDiv", "id": "question" + i})
        .append(
          $("<h1/>", {"class": "questionChar"})
        ).append(
          $("<ul>", {"class": "questionChoices"})
        )
    );
    createQuestionText(i);
  }
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
      if (lessonNum < 0 || lessonNum > NUM_OF_LESSONS) {
        throw new LessonException("InvalidLessonNumber");
      } else if (lessonNum > 2) {
        characterArray = response.kanji;
      } else {
        characterArray = response.syllabary;
      }
      // console.log(JSON.stringify(characterArray));
      createQuestions();
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

$(document).ready(function(){
  listLessons();
  $("#lesson_select").change(loadJSON);
  $("input[type=radio][name=lessonFocus]").change(createQuestions);
  loadJSON();
});
