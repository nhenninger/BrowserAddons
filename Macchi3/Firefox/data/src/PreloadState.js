var preloadState = {
  preload: function() {
    var loadingText = game.add.text(80,150, "Loading...", {font: "30px Arial", fill: "#fff"});
    game.load.spritesheet("gems", "assets/gems.png", GEM_DIMENSION, GEM_DIMENSION); // TODO: write CC-BY attribution in extension description and in a license file
    game.load.json("lessons", "lessons.json");
  },

  create: function() {
    game.state.start("menu");
  }
};
