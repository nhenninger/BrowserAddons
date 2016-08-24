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

function finalScore() {
  for (var x = 0; x < characterArray.length; x++) {
    if ($("div#question" + x + " input[type=radio][name=question" + x + "]:checked").val() === answerArray[x]) {
      numCorrect++;
    }
  }
  // TODO: wire a listener to when quiz is complete then populate resultDiv with score
  // TODO: Make the radio buttons pretty
  console.log(numCorrect + " out of " + characterArray.length);
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
                .bind("click", advanceQuestion)
              )
              .append(characterArray[indices[k]][typeChoice])
          )
      );
  }
}

function chooseYomi() {
  return Math.random() <= 0.5 ? "on_yomi" : "kun_yomi";
}

/**
 *  Fills out the question slide with the question (i.e. the character)
 *  and the multiple-choice options with the correct answer and several
 *  incorrect options randomly pulled from the other characters in the
 *  current lesson.
 */
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
    $("input[type=radio][name=lessonFocus]").attr("disabled", true);
    $("#question" + index + " h1").append(characterArray[index].kana);
    answerArray[index] = characterArray[index].pronunciation;
    createQuestionChoices("pronunciation", index, choiceIndices);
  } else if (characterArray[0].character) { // Kanji
    $("input[type=radio][name=lessonFocus]").attr("disabled", false);
    $("#question" + index + " h1").append(characterArray[index].character);
    if ($("input[type=radio][name=lessonFocus]:checked").val() === "meaning") {
      answerArray[index] = characterArray[index].meaning;
      createQuestionChoices("meaning", index, choiceIndices);
    } else if ($("input[type=radio][name=lessonFocus]:checked").val() === "reading") {
      var yomi = chooseYomi();
      answerArray[index] = characterArray[index][yomi];
      createQuestionChoices(yomi, index, choiceIndices);
    } else {
      console.log("questionException displaying kanjiMeaningOrReading text");
      throw new QuestionException("InvalidMeaningOrReading");
    }
  } else {
    console.log("questionException displaying question text");
    throw new QuestionException("InvalidQuestionSet");
  }
}

// handle the next clicking functionality
function advanceQuestion(){
  var n = $(".slide.active").index() + 1;
  var slideLeft = "-" + n * 100 + "%";
  if (!$(".slide.active").hasClass("last")) {
      $(".slide.active").removeClass("active").next(".slide").addClass("active");
      $("#slides_div").animate({
          marginLeft : slideLeft
      },250);
      if ($(".slide.active").hasClass("last")) {
          $("#next_button").addClass("disabled");
          // TODO: change next button to disable on final question and call finalScore()
          // TODO: Wire finish_button to finalScore();
      }
  }
  if ((!$(".slide.active").hasClass("first")) && $("#prev_button").hasClass("disabled")) {
      $("#prev_button").removeClass("disabled");
  }
}

// handle the prev clicking functionality
function recedeQuestion(){
  var n = $(".slide.active").index() - 1;
  var slideRight = "-" + n * 100 + "%";
  if (!$(".slide.active").hasClass("first")) {
      $(".slide.active").removeClass("active").prev(".slide").addClass("active");
      $("#slides_div").animate({
          marginLeft : slideRight
      },250);
      if ($(".slide.active").hasClass("first")) {
          $("#prev_button").addClass("disabled");
      }
  }
  if ((!$(".slide.active").hasClass("last")) && $("#next_button").hasClass("disabled")) {
      $("#next_button").removeClass("disabled");
  }
}

// Based on http://callmenick.com/post/responsive-content-slider
function contentSlide() {
  var len = $(".slide").length;                // get number of slides
  // console.log("len is " + len + "\n");
  var slidesContainerWidth = len * 100 + "%";  // get width of the slide container
  var slideWidth = (100 / len) + "%";          // get width of the slides

  // Reset margins when changing quiz
  $("#slides_div").animate({
      marginLeft : 0
  },250);
  $("#slides_div").animate({
      marginRight : 0
  },250);

  // Reset click listeners
  $("#next_button").unbind("click");
  $("#prev_button").unbind("click");

  // set slide container width
  $("#slides_div").css({
      width : slidesContainerWidth,
      visibility : "visible"
  });
  // set slide width
  $(".slide").css({
      width : slideWidth
  });

  // add correct classes to first and last slide
  $(".slide").first().addClass("first active");
  console.log($(".slide").first().attr("id"));
  $(".slide").last().addClass("last");

  // initially disable the previous arrow cuz [sic] we start on the first slide
  $("#prev_button").addClass("disabled");

  $("#next_button").bind("click", advanceQuestion);
  $("#prev_button").bind("click", recedeQuestion);
}

/**
 *  Creates the basic question slides/divs and the results slide
 */
function createSlides() {
  numCorrect = 0;
  var slides = $("#slides_div");
  slides.empty();
  // shuffle(characterArray);  TODO: uncomment...
  for (var i = 0; i < characterArray.length; i++) {
    slides.append(
      $("<div/>", {"class": "slide", "id": "question" + i})
        .append(
          $("<h1/>", {"class": "questionChar"})
        ).append(
          $("<ul>", {"class": "questionChoices"})
        )
    );
    createQuestionText(i);
  }
  slides.append(
    $("<div/>", {"class": "slide", "id": "resultDiv"})
      .append(
        $("<h1/>", {"class": "questionChar", "id": "resultH1"})
      ).append(
        $("<input/>", {"type": "button", "value": "再", "id": "restartButton"})
          .click(createSlides)
      )
  );
  contentSlide();
}

/**
 *  Loads the selected lesson JSON file and populates the characterArray.
 */
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
      createSlides();
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
  $("input[type=radio][name=lessonFocus]").change(createSlides);
  loadJSON();
});
