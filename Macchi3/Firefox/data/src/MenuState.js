Macchi3.MenuState = function() {
  this.BUTTON_ROWS = 5;
  this.BUTTON_COLS = 5;
};

Macchi3.MenuState.prototype = {
  create: function() {
    Macchi3.game.add.image(
      Macchi3.game.world.centerX,
      Macchi3.game.world.centerY,
      "backgroundPicture").anchor.set(0.5);
    Macchi3.game.add.text(
      Macchi3.game.world.centerX,
      80,
      "マッチ3",
      {font: "100px Arial", fill: "#fff", strokeThickness: 15}).anchor.set(0.5);
    var levelNumber = 1;
    for (let i = 0; i < this.BUTTON_ROWS; i++) {
      for (let j = 0; j < this.BUTTON_COLS; j++) {
        if ((i === this.BUTTON_ROWS - 1 && j === 0) ||
          (i === this.BUTTON_ROWS - 1 && j === this.BUTTON_COLS - 1)) {
          continue;
        }
        var orb = Macchi3.game.add.button(
          Macchi3.GEM_DIMENSION * j + Macchi3.game.world.centerX / 2,
          Macchi3.GEM_DIMENSION * i + Macchi3.game.world.centerY / 2,
          "gems_spritesheet", this.start, this);
        orb.anchor.set(0.5);
        orb.alpha = 0.5;
        var randomColor = Macchi3.game.rnd.between(
          0,
          Macchi3.NUM_GEM_GROUPS - 1);
        orb.frame = randomColor;
        orb.levelNumber = levelNumber;
        Macchi3.game.add.text(
          Macchi3.GEM_DIMENSION * j + Macchi3.game.world.centerX / 2,
          Macchi3.GEM_DIMENSION * i + Macchi3.game.world.centerY / 2,
          orb.levelNumber,
          {font: "50px Arial", fill: "#fff", strokeThickness: 5}).anchor.set(0.5);
        levelNumber++;
      }
    }

    Macchi3.game.add.text(
      Macchi3.game.world.centerX,
      Macchi3.game.height - 80,
      "Press 'Q' during the game to return to menu.",
      {font: "25px Arial", fill: "#fff", strokeThickness: 3}).anchor.set(0.5);

    // TODO: add gem images raining down screen on menu.  Or make buttons wiggle.  See http://www.emanueleferonato.com/2014/10/07/how-to-bring-your-html5-games-title-screen-to-life-in-a-minute-with-phaser/
  },

  start: function(button) {
    Macchi3.lessonNum = button.levelNumber;
    Macchi3.game.state.start("GameState");
  }
};
