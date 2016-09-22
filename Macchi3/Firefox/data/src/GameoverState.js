var gameOverState = {
  create: function() {
    var winLabel = game.add.text(80, 80, "YOU WON!", {font: "50px Times New Roman", fill: "#00FF00"});

    var startLabel = game.add.text(80, game.world.height - 80, "Press the 'w' key to restart", {font: "25px Times New Roman", fill: "#fff"});
    
    var wkey = game.input.keyboard.addKey(Phaser.keyboard.W);
    wkey.onDown.addOnce(this.start, this);
  },

  restart: function() {
    game.state.start("menu");
  }
};
