Macchi3.MenuState = function(game) {

};

Macchi3.MenuState.prototype = {
  create: function() {
    this.add.image(
      this.world.centerX,
      this.world.centerY,
      "backgroundPicture").anchor.set(0.5);
    var nameLabel = this.add.text(
      this.world.centerX,
      80,
      "マッチ3",
      {font: "50px Arial", fill: "#fff"}).anchor.set(0.5);
    var playButton = this.add.button(
      this.world.centerX,
      this.world.centerY,
      "startButton",
      this.start,
      this).anchor.set(0.5);
    // var startLabel = this.add.text(80, this.world.height - 80, "Press the 'w' key to start", {font: "25px Times New Roman", fill: "#fff"});

    // TODO: add gem images raining down screen on menu.  See http://www.emanueleferonato.com/2014/10/07/how-to-bring-your-html5-games-title-screen-to-life-in-a-minute-with-phaser/

    //
    // var wkey = this.input.keyboard.addKey(Phaser.keyboard.W);
    // wkey.onDown.addOnce(this.start, this);
  },

  start: function() {
    this.state.start("GameState");
  }
};
