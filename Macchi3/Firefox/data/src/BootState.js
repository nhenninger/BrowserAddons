var Macchi3 = {
  BOARD_DIMENSION: 8,
  GEM_DIMENSION: 100,
  NUM_GEM_GROUPS: 6,
  SWAP_SPEED: 200,
  FALL_SPEED: 1000,
  DESTROY_SPEED: 500,
  FAST_FALL: true,
  lessonNum: 0,
  score: 0,
  scoreText: "",
  gameArray: [],
  currCharacterArray: [],
  removeMap: [],
  colorGroupIsOn: true,
  canSelect: false
};

Macchi3.BootState = function(game) {
  Macchi3.game = game;
};

Macchi3.BootState.prototype = {
  preload: function() {
  },

  create: function() {
    // Macchi3.game.input.maxPointers = 1;
    // Macchi3.game.stage.disableVisibilityChange = false;
    // Macchi3.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // Macchi3.game.scale.pageAlignHorizontally = true;
    // Macchi3.game.scale.pageAlignVertically = true;
    // Macchi3.game.input.addPointer();
    // Macchi3.game.physics.startSystem(Phaser.Physics.ARCADE);
    Macchi3.game.state.start("PreloadState");
  }
};
