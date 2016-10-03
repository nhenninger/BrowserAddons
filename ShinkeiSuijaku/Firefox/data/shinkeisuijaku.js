
window.onload = function() {
  var currCardSet = []; // A random subset from the lesson file
  var currLesson = 0;
  var latinTextIsOn;
  var memoryValues = [];
  var memoryCardIds = [];
  var cardsFlipped = 0;
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

  function listLessons() {
    var lessonDropdown = document.getElementById("lesson_select");
    for (let i = 1; i <= NUM_OF_LESSONS; i++) {
      var newOption = document.createElement("option");
      if (i === 1) {
        newOption.setAttribute("selected", "selected");
      }
      newOption.setAttribute("value", i);
      newOption.appendChild(document.createTextNode("Lesson " + i));
      lessonDropdown.appendChild(newOption);
    }
  }

// Populate currCardSet[] with random entries from the JSON file
  function loadJSON(callback) {
    currLesson = parseInt(document.getElementById("lesson_select").value, 10);
    var request = new XMLHttpRequest();
    var url = "lessons/lesson" + currLesson + ".json";
    request.overrideMimeType("application/json");
    request.open("GET", url, true);
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
      // .open will NOT return a value but simply returns undefined in async mode so use a callback
        callback(request.responseText);
      }
    };
    request.send(null);
  }

  function loadLesson(response) {
    var jsonResponse = JSON.parse(response);
    if (currLesson > 2) {
      currCardSet = jsonResponse.kanji;
    } else if (currLesson > 0) {
      currCardSet = jsonResponse.syllabary;
    } else {
      throw new LessonException("InvalidLessonNumber");
    }
  // Duplicates the array
    currCardSet = currCardSet.concat(currCardSet);
    currCardSet = shuffle(currCardSet);
    displayCards();
  }

  function isFlipped(card) {
    if (card.classList.contains("flipped")) {
      return true;
    } else {
      return false;
    }
  }

  function setFlipped(card) {
    if (isFlipped(card)) {
      card.classList.remove("flipped");
    } else {
      card.classList.add("flipped");
    }
  }

  function flip2Back() {
  // Flip the 2 cards back over
    var card1 = document.getElementById(memoryCardIds[0]);
    var card2 = document.getElementById(memoryCardIds[1]);
    if (card1) {
      setFlipped(card1);
    }
    if (card2) {
      setFlipped(card2);
    }
  // Clear both arrays
    memoryValues = [];
    memoryCardIds = [];
  }

  function displayCardText(card) {
    if (card.kana) {
      return String(card.kana) +
           card.pronunciation;
    } else if (card.character) {
      return String(card.character) +
           card.meaning;
    } else {
      console.log("cardException displaying card text");
      throw new CardException("InvalidCardSet");
    }
  }

  function memoryFlipCard() {
    if (!isFlipped(this) && memoryValues.length < 2) {
      setFlipped(this);
      if (memoryValues.length === 0) {
        memoryValues.push(this.textContent);
        memoryCardIds.push(this.id);
      } else if (memoryValues.length === 1) {
        memoryValues.push(this.textContent);
        memoryCardIds.push(this.id);
        if (memoryValues[0] === memoryValues[1]) {
          cardsFlipped += 2;
        // Clear both arrays
          memoryValues = [];
          memoryCardIds = [];
        // Check to see if the whole board is cleared
          if (cardsFlipped === currCardSet.length) {
            alert("Board cleared... generating new board");
            loadJSON(loadLesson);
          }
        } else {
          setTimeout(flip2Back, 700);
        }
      }
    }
  }

  function toggleLatinText() {
    latinTextIsOn = !latinTextIsOn;
    var latinDivArray = document.getElementsByClassName("latin_text");
    for (let i = 0; i < latinDivArray.length; i++) {
      if (window.getComputedStyle(latinDivArray[i], null)
      .getPropertyValue("visibility") === "visible") {
        latinDivArray[i].style.visibility = "hidden";
      } else {
        latinDivArray[i].style.visibility = "visible";
      }
    }
  }

// With inspiration from the script by Adam Khoury from the video tutorial:
// http://www.youtube.com/watch?v=c_ohDPWmsM0
  function displayCards() {     // TODO: add support for Anki cards (or some alternative?)
                              // TODO: add support for audio cards?
    var board = document.getElementById("memory_board");
    while (board.hasChildNodes()) {
      board.removeChild(board.firstChild);
    }
    flip2Back();
    latinTextIsOn = document.getElementById("toggleLatinTextCheck").checked;
    cardsFlipped = 0;
    for (let i = 0; i < currCardSet.length; i++) {
      var card = document.createElement("div");
      card.setAttribute("id", "card_" + i);
      card.setAttribute("class", "card");
      var cardText = displayCardText(currCardSet[i]);
      card.addEventListener("click", memoryFlipCard);
      var cardContainer = document.createElement("div");
      cardContainer.setAttribute("class", "cardContainer");
      var cardFront = document.createElement("div");
      cardFront.setAttribute("class", "cardFront");
      cardFront.appendChild(document.createTextNode("集中"));
      var cardBack = document.createElement("div");
      cardBack.setAttribute("class", "cardBack");
      cardBack.appendChild(document.createTextNode(cardText[0]));
      cardBack.appendChild(document.createElement("br"));
      var cardBackLatin = document.createElement("div");
      cardBackLatin.setAttribute("class", "latin_text");
      cardBackLatin.appendChild(
        document.createTextNode(
          cardText.substring(
            1, cardText.length)));
      if (!latinTextIsOn) {
        cardBackLatin.style.visibility = "hidden";
      }
      cardBack.appendChild(cardBackLatin);
      cardContainer.appendChild(cardFront);
      cardContainer.appendChild(cardBack);
      card.appendChild(cardContainer);
      board.appendChild(card);
    }
  }

  document.getElementById("lesson_select")
    .addEventListener("change", function() {
      loadJSON(loadLesson);
    });
  document.getElementById("toggleLatinTextCheck")
    .addEventListener("change", toggleLatinText);
  listLessons();
  loadJSON(loadLesson);
};
