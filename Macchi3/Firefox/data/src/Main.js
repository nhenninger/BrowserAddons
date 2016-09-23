/* With thanks to http://www.emanueleferonato.com/2016/05/17/match-3-bejeweled-html5-prototype-made-with-phaser/ */

var colorGroupIsOn;
var currCharacterArray = [];
var platforms;
var cursors;
var score = 0;
var scoreText;
const NUM_OF_GEM_GROUPS = 6;
const BOARD_DIMENSION = 8;
const GEM_DIMENSION = 100;

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

window.onload = function() {
  var game = new Phaser.Game(BOARD_DIMENSION * GEM_DIMENSION, BOARD_DIMENSION * GEM_DIMENSION, Phaser.AUTO, "game_div");
  game.state.add("BootState", Macchi3.BootState);
  game.state.add("PreloadState", Macchi3.PreloadState);
  game.state.add("MenuState", Macchi3.MenuState);
  game.state.add("GameState", Macchi3.GameState);
  game.state.add("GameoverState", Macchi3.GameoverState);
  game.state.start("BootState");
};
