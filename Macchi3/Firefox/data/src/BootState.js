var Macchi3 = Macchi3 || {};

Macchi3.BootState = function(game) {};

Macchi3.BootState.prototype = {
  preload: function() {
  },

  create: function() {
    // this.input.maxPointers = 1;
    // this.stage.disableVisibilityChange = false;
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;
    // this.input.addPointer();
    // this.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start("PreloadState");
  }
};
