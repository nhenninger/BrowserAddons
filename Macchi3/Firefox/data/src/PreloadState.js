Macchi3.PreloadState = function(game) {
  this.preloadBar = null;
  this.titleText = "";
  this.ready = false;
};

Macchi3.PreloadState.prototype = {
  preload: function() {
    this.add.text(
      this.world.centerX,
      this.world.centerY,
      "ローディング...",
      {font: "30px Arial", fill: "#fff"}).anchor.set(0.5, 0.5);
    // TODO: find font for the title on the menu page
    this.load.json("lessons", "lessons.json");
    this.load.spritesheet(
      "gems_spritesheet",
      "assets/gems.png",
      GEM_DIMENSION,
      GEM_DIMENSION); // TODO: write CC-BY attribution in extension description and in a license file
    this.load.image("backgroundPicture", "assets/back_cave.png");
    this.load.image("startButton", "assets/start_button.png");
  },

  create: function() {
    // this.add.image(this.world.centerX, this.world.centerY, "backgroundPicture").anchor.set(0.5, 0.5);
  },

  update: function() {
    this.ready = true;
    this.state.start("MenuState");
  }
};
