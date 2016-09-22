var gameState = {
  create: function() {
    this.keyboard = game.input.keyboard;
    this.player = game.add.sprite(16, 16, "player");
    game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.win = game.add.sprite(16, 16, "win");
    game.physics.enable(this.win, Phaser.Physics.ARCADE);
  },

  update: function() {
    game.physics.arcade.overlap(this.player, this.win, this.Win, null, this);

		if (this.keyboard.isDown(Phaser.Keyboard.A)) {
			this.player.body.velocity.x = -175;
		} else if (this.keyboard.isDown(Phaser.Keyboard.D)) {
			this.player.body.velocity.x = 175;
		} else {
			this.player.body.velocity.x = 0;
		}
		// Enabling movement along the y axis
		if (this.keyboard.isDown(Phaser.Keyboard.W)) {
			this.player.body.velocity.y = -175;
		} else if (this.keyboard.isDown(Phaser.Keyboard.S)) {
			this.player.body.velocity.y = 175;
		} else{
			this.player.body.velocity.y = 0;
		}
  },

  Win: function() {
    game.state.start("gameOver");
  }
};
