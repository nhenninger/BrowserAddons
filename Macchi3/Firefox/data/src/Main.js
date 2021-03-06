window.onload = function() {
  var game = new Phaser.Game(
    Macchi3.BOARD_DIMENSION * Macchi3.GEM_DIMENSION,
    Macchi3.BOARD_DIMENSION * Macchi3.GEM_DIMENSION,
    Phaser.AUTO,
    "game_div");
  game.state.add("BootState", Macchi3.BootState);
  game.state.add("PreloadState", Macchi3.PreloadState);
  game.state.add("MenuState", Macchi3.MenuState);
  game.state.add("GameState", Macchi3.GameState);
  game.state.add("GameoverState", Macchi3.GameoverState);
  game.state.start("BootState");
};
