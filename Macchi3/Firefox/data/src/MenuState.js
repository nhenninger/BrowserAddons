var menuState = {
  create: function() {
    var nameLabel = game.add.text(80, 80, "My First Game", {font: "50px Times New Roman", fill: "#fff"});
    var startLabel = game.add.text(80, game.world.height - 80, "Press the 'w' key to start", {font: "25px Times New Roman", fill: "#fff"});

    var wkey = game.input.keyboard.addKey(Phaser.keyboard.W);
    wkey.onDown.addOnce(this.start, this);
  },

  start: function() {
    game.state.start("game");
  }
};
