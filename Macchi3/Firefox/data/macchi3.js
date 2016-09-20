/*jshint esversion: 6 */
var colorGroupIsOn;
var currCharacterArray = [];
var platforms;
var cursors;
var score = 0;
var scoreText;
const NUM_OF_TILE_GROUPS = 6;

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
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
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

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update });
