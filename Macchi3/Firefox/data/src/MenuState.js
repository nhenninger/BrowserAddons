Macchi3.MenuState = function() {

};

Macchi3.MenuState.prototype = {
  create: function() {
    Macchi3.game.add.image(
      Macchi3.game.world.centerX,
      Macchi3.game.world.centerY,
      "backgroundPicture").anchor.set(0.5);
    var nameLabel = Macchi3.game.add.text(
      Macchi3.game.world.centerX,
      80,
      "マッチ3",
      {font: "50px Arial", fill: "#fff"}).anchor.set(0.5);
    var playButton = Macchi3.game.add.button(
      Macchi3.game.world.centerX,
      Macchi3.game.world.centerY,
      "startButton",
      this.start,
      this).anchor.set(0.5);
    // var startLabel = Macchi3.game.add.text(80, Macchi3.game.world.height - 80, "Press the 'w' key to start", {font: "25px Times New Roman", fill: "#fff"});

    // TODO: add gem images raining down screen on menu.  See http://www.emanueleferonato.com/2014/10/07/how-to-bring-your-html5-games-title-screen-to-life-in-a-minute-with-phaser/

    //
    // var wkey = Macchi3.game.input.keyboard.addKey(Phaser.keyboard.W);
    // wkey.onDown.addOnce(Macchi3.game.start, this);
  },

  start: function() {
    Macchi3.game.state.start("GameState");
  }
};
