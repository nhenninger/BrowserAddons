$(document).ready(function() {
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

  function setProgress(progress) {
    $(".progressBar").animate({width: progress + "%"}, 300);
  }

  function finalScore() {
    var numCorrect = 0;
    for (var x = 0; x < characterArray.length; x++) {
      if ($("div#question" +
      x +
      " input[type=radio][name=question" +
      x +
      "]:checked").val() === answerArray[x]) {
        numCorrect++;
      }
    }
  // TODO: Make the radio buttons pretty
    $("#resultH1").empty().append(numCorrect +
      " out of " +
      characterArray.length + ".");
    $("#prev_button").addClass("disabled").off("click", recedeQuestion);
    $("#next_button").addClass("disabled").off("click", advanceQuestion);
    $("#finish_button").addClass("disabled").off("click", finalScore);
    $("div.slide.active").removeClass("active");

    var n = $("div.slide.last_question").index() + 1;
    var slideLeft = "-" + n * 100 + "%";
    $("#slides_container").animate({
      marginLeft: slideLeft
    }, 250);
    setProgress(100);
  }

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(arr) {
    var currentIndex = arr.length;
    var temporaryValue;
    var randomIndex;
  // While there remain elements to shuffle...
    while (currentIndex !== 0) {
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
      $("div#question" + questionIndex + " .questionChoices")
      .append(
        $("<label/>", {class: "block"})
          .append(
            $("<input/>", {
              type: "radio",
              name: "question" + questionIndex,
              value: characterArray[indices[k]][typeChoice]})
            .bind("click", advanceQuestion)
          )
          .append(characterArray[indices[k]][typeChoice])
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
    while (choiceIndices.length < NUM_OF_MULTI_CHOICE) {
    // https://stackoverflow.com/questions/2380019/generate-unique-random-numbers-between-1-and-100
      rand = Math.floor(Math.random() * characterArray.length);
      var found = false;
      for (var i = 0; i <= choiceIndices.length; i++) {
        if (choiceIndices[i] === rand) {
          found = true;
          break;
        }
      }
      if (!found) {
        choiceIndices[choiceIndices.length] = rand;
      }
    }
    shuffle(choiceIndices);
    if (characterArray[0].kana) { // Syllabary
      $("input[type=radio][name=lessonFocus]").attr("disabled", true);
      $("div#question" + index + " h1").append(characterArray[index].kana);
      answerArray[index] = characterArray[index].pronunciation;
      createQuestionChoices("pronunciation", index, choiceIndices);
    } else if (characterArray[0].character) { // Kanji
      $("input[type=radio][name=lessonFocus]").attr("disabled", false);
      $("div#question" + index + " h1").append(characterArray[index].character);
      if ($("input[type=radio][name=lessonFocus]:checked").val() === "meaning") {
        answerArray[index] = characterArray[index].meaning;
        createQuestionChoices("meaning", index, choiceIndices);
      } else if ($("input[type=radio][name=lessonFocus]:checked").val() ===
      "reading") {
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
  function advanceQuestion() {
    var n = $("div.slide.active").index() + 1;
    var slideLeft = "-" + n * 100 + "%";
    if (!$("div.slide.active").hasClass("last_question")) {
      $("div.slide.active")
    .removeClass("active")
    .next("div.slide")
    .addClass("active");
      $("#slides_container").animate({
        marginLeft: slideLeft
      }, 250);
      if ($("div.slide.active").hasClass("last_question")) {
        $("#next_button").addClass("disabled");
      }
      setProgress((n + 1) / characterArray.length * 100);
    }
    if ((!$("div.slide.active").hasClass("first_question")) &&
  $("#prev_button").hasClass("disabled")) {
      $("#prev_button").removeClass("disabled");
    }
  }

// handle the prev clicking functionality
  function recedeQuestion() {
    var n = $("div.slide.active").index() - 1;
    var slideRight = "-" + n * 100 + "%";
    if (!$("div.slide.active").hasClass("first_question")) {
      $("div.slide.active")
    .removeClass("active")
    .prev("div.slide")
    .addClass("active");
      $("#slides_container").animate({
        marginLeft: slideRight
      }, 250);
      if ($("div.slide.active").hasClass("first_question")) {
        $("#prev_button").addClass("disabled");
      }
      setProgress((n + 1) / characterArray.length * 100);
    }
    if ((!$("div.slide.active").hasClass("last_question")) &&
  $("#next_button").hasClass("disabled")) {
      $("#next_button").removeClass("disabled");
    }
  }

// Based on http://callmenick.com/post/responsive-content-slider
  function contentSlide() {
    var len = $("div.slide").length;                // get number of slides
  // console.log("len is " + len + "\n");
    var slidesContainerWidth = len * 100 + "%";  // get width of the slide container
    var slideWidth = (100 / len) + "%";          // get width of the slides

  // Reset margins when changing quiz
    $("#slides_container").animate({
      marginLeft: 0
    }, "slow");
    $("#slides_container").animate({
      marginRight: 0
    }, "slow");

  // set slide container width
    $("#slides_container").css({
      width: slidesContainerWidth,
      visibility: "visible"
    });
  // set slide width
    $("div.slide").css({
      width: slideWidth
    });

  // add correct classes to first and last slide
    $("div.slide").first().addClass("first_question active");
    $("div.slide").last().prev().addClass("last_question");

  // Initialize navigation
    $("#prev_button").addClass("disabled").off().on("click", recedeQuestion);
    $("#next_button").removeClass("disabled").off().on("click", advanceQuestion);
    $("#finish_button").removeClass("disabled").off().on("click", finalScore);
    setProgress(1 / characterArray.length * 100);
  }

/**
 *  Creates the basic question slides/divs and the results slide
 */
  function createSlides() {
    var slides = $("#slides_container");
    slides.empty();
    shuffle(characterArray);
    for (var i = 0; i < characterArray.length; i++) {
      slides.append(
      $("<div/>", {class: "slide", id: "question" + i})
        .append(
          $("<h1/>", {class: "questionChar"})
        ).append(
          $("<div/>", {class: "questionChoices"})
        )
    );
      createQuestionText(i);
    }
    slides.append(
    $("<div/>", {class: "slide", id: "resultDiv"})
      .append(
        $("<h1/>", {class: "questionChar", id: "resultH1"})
      ).append(
        $("<input/>", {type: "button",
                      value: "再",
                      id: "restartButton",
                      title: "Restart Quiz"})
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
      url: "lessons/lesson" + lessonNum + ".json",
      success: function(response) {
        if (lessonNum < 0 || lessonNum > NUM_OF_LESSONS) {
          throw new LessonException("InvalidLessonNumber");
        } else if (lessonNum > 2) {
          characterArray = response.kanji;
        } else {
          characterArray = response.syllabary;
        }
        createSlides();
      }
    });
  }

  function listLessons() {
    for (var i = 1; i <= NUM_OF_LESSONS; i++) {
      $("<option>", {
        value: i,
        text: "Lesson " + i
      }).appendTo("#lesson_select");
    }
    $("option:first").prop("selected", true);
  }

  listLessons();
  $("#lesson_select").change(loadJSON);
  $("input[type=radio][name=lessonFocus]").change(createSlides);
  loadJSON();
});
