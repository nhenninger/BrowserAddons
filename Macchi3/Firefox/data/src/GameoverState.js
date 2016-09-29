Macchi3.GameoverState = function() {

};

Macchi3.GameoverState.prototype = {
  create: function() {
  },

  restart: function() {
    Macchi3.game.state.start("MenuState");
  }
};
