Macchi3.GameoverState = function(game) {

};

Macchi3.GameoverState.prototype = {
  create: function() {
  },

  restart: function() {
    this.state.start("MenuState");
  }
};
