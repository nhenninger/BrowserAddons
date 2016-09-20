/*jshint esversion: 6 */
/* With thanks to http://www.emanueleferonato.com/2016/05/17/match-3-bejeweled-html5-prototype-made-with-phaser/ */

var colorGroupIsOn;
var currCharacterArray = [];
var platforms;
var cursors;
var score = 0;
var scoreText;
const NUM_OF_TILE_GROUPS = 6;
const BOARD_DIMENSION = 8;
const TILE_DIMENSION = 100;

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

function preload () {
  game.load.spritesheet('gems', 'assets/gems2.png', TODO, TODO); // TODO: write CC-BY attribution in extension description and in a license file
  game.load.json('version', 'lessons.json');
}

function create () {

  game.stage.backgroundColor = '#0072bc';

  var phaserJSON = game.cache.getJSON('version');

  console.log(JSON.stringify(shuffle(phaserJSON.lesson1)));

  var text2 = game.add.text(100, 200, "Name: " + phaserJSON.name, { fill: '#ffffff' });
  text2.setShadow(2, 2, 'rgba(0,0,0,0.5)', 0);

  var text3 = game.add.text(100, 300, "Released: " + phaserJSON.released, { fill: '#ffffff' });
  text3.setShadow(2, 2, 'rgba(0,0,0,0.5)', 0);
}

function update() {
}

function collectStar (player, star) {
  // Removes the star from the screen
  star.kill();

  //  Add and update the score
  score += 10;
  scoreText.text = 'Score: ' + score;
}

game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update });
