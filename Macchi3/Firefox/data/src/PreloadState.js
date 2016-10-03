Macchi3.PreloadState = function() {
  Macchi3.game.preloadBar = null;
  Macchi3.game.titleText = "";
  Macchi3.game.ready = false;
  Macchi3.orbGroup = {};
  Macchi3.selectedOrb = {};
};

Macchi3.PreloadState.prototype = {
  preload: function() {
    Macchi3.game.add.text(
      Macchi3.game.world.centerX,
      Macchi3.game.world.centerY,
      "ローディング...",
      {font: "30px Arial", fill: "#fff"}).anchor.set(0.5, 0.5);
    // TODO: find font for the title on the menu page
    Macchi3.game.load.json("lessons", "lessons.json");
    Macchi3.game.load.spritesheet(
      "gems_spritesheet",
      "assets/gems.png",
      Macchi3.GEM_DIMENSION,
      Macchi3.GEM_DIMENSION);
    Macchi3.game.load.image("backgroundPicture", "assets/back_cave.png");
    Macchi3.game.load.image("startButton", "assets/start_button.png");
  },

  create: function() {
  },

  update: function() {
    Macchi3.game.ready = true;
    Macchi3.game.state.start("MenuState");
  }
};
