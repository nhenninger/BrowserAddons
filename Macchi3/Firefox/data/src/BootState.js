var Macchi3 = {};

Macchi3.bootState = function(game) {
  preload: function() {
    this.game.load.image("loading","assets/loading.png");
	},
  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.state.start("preload");
  }
};
