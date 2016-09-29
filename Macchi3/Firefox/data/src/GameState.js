/* With thanks to http://www.emanueleferonato.com/2016/05/17/match-3-bejeweled-html5-prototype-made-with-phaser/ */

Macchi3.GameState = function() {
};

Macchi3.GameState.prototype = {
  create: function() {
    this.drawField();
    Macchi3.canSelect = true;
    Macchi3.game.input.onDown.add(this.orbSelect.bind(this));
    Macchi3.game.input.onUp.add(this.orbDeselect.bind(this));
  },

  update: function() {
  },

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffle: function(arr) {
    var currentIndex = arr.length;
    var temporaryValue;
    var randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
     // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
     // And swap it with the current element.
      temporaryValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
    }
    return arr;
  },

  win: function() {
    Macchi3.game.state.start("GameoverState");
  },

  drawField: function() {
    // console.log(this);
    Macchi3.orbGroup = Macchi3.game.add.group();
    for (let i = 0; i < Macchi3.BOARD_DIMENSION; i++) {
      Macchi3.gameArray[i] = [];
      for (let j = 0; j < Macchi3.BOARD_DIMENSION; j++) {
        var orb = Macchi3.game.add.sprite(
          Macchi3.GEM_DIMENSION * j + Macchi3.GEM_DIMENSION / 2,
          Macchi3.GEM_DIMENSION * i + Macchi3.GEM_DIMENSION / 2,
          "gems_spritesheet");
        orb.anchor.set(0.5);
        Macchi3.orbGroup.add(orb);
        do {
          var randomColor = Macchi3.game.rnd.between(
            0,
            Macchi3.NUM_GEM_GROUPS - 1);
          orb.frame = randomColor;
          Macchi3.gameArray[i][j] = {
            orbColor: randomColor,
            orbSprite: orb
          };
        } while (this.isMatch(i, j));
      }
    }
    Macchi3.selectedOrb = null;
  },

  orbSelect: function(e) {
    console.log(Macchi3.canSelect);
    if (Macchi3.canSelect) {
      var row = Math.floor(e.clientY / Macchi3.GEM_DIMENSION);
      var col = Math.floor(e.clientX / Macchi3.GEM_DIMENSION);
      var pickedOrb = this.gemAt(row, col);
      if (pickedOrb !== -1) {
        if (Macchi3.selectedOrb === null) {
          pickedOrb.orbSprite.scale.setTo(1.2);
          pickedOrb.orbSprite.bringToTop();
          Macchi3.selectedOrb = pickedOrb;
          // Macchi3.game.input.addMoveCallback(this.orbMove.bind(this));
        } else if (this.areTheSame(pickedOrb, Macchi3.selectedOrb)) {
          Macchi3.selectedOrb.orbSprite.scale.setTo(1);
          Macchi3.selectedOrb = null;
        } else if (this.areNext(pickedOrb, Macchi3.selectedOrb)) {
          Macchi3.selectedOrb.orbSprite.scale.setTo(1);
          this.swapOrbs(Macchi3.selectedOrb, pickedOrb, true);
        } else {
          Macchi3.selectedOrb.orbSprite.scale.setTo(1);
          pickedOrb.orbSprite.scale.setTo(1.2);
          Macchi3.selectedOrb = pickedOrb;
          // Macchi3.game.input.addMoveCallback(this.orbMove.bind(this));
        }
      }
    }
  },

  orbDeselect: function(e) {
    // console.log(this);
    // Macchi3.game.input.deleteMoveCallback(this.orbMove.bind(this));
  },

  orbMove: function(event, pX, pY) {
    if (event.id === 0) {
      var distX = pX - Macchi3.selectedOrb.orbSprite.x;
      var distY = pY - Macchi3.selectedOrb.orbSprite.y;
      var deltaRow = 0;
      var deltaCol = 0;
      if (Math.abs(distX) > Macchi3.GEM_DIMENSION / 2) {
        if (distX > 0) {
          deltaCol = 1;
        } else {
          deltaCol = -1;
        }
      } else if (Math.abs(distY) > Macchi3.GEM_DIMENSION / 2) {
        if (distY > 0) {
          deltaRow = 1;
        } else {
          deltaRow = -1;
        }
      }
      if (deltaRow + deltaCol !== 0) {
        var pickedOrb = this.gemAt(
          this.getOrbRow(Macchi3.selectedOrb) + deltaRow,
          this.getOrbCol(Macchi3.selectedOrb) + deltaCol);
        if (pickedOrb !== -1) {
          Macchi3.selectedOrb.orbSprite.scale.setTo(1);
          this.swapOrbs(Macchi3.selectedOrb, pickedOrb, true);
          // Macchi3.game.input.deleteMoveCallback(this.orbMove.bind(this));
        }
      }
    }
  },

  swapOrbs: function(orb1, orb2, swapBack) {
    Macchi3.canSelect = false;
    var fromColor = orb1.orbColor;
    var fromSprite = orb1.orbSprite;
    var toColor = orb2.orbColor;
    var toSprite = orb2.orbSprite;
    Macchi3.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)]
      .orbColor = toColor;
    Macchi3.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)]
      .orbSprite = toSprite;
    Macchi3.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)]
      .orbColor = fromColor;
    Macchi3.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)]
      .orbSprite = fromSprite;
    var orb1Tween = Macchi3.game.add.tween(
      Macchi3.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbSprite)
        .to({
          x: this.getOrbCol(orb1) * Macchi3.GEM_DIMENSION +
            Macchi3.GEM_DIMENSION / 2,
          y: this.getOrbRow(orb1) * Macchi3.GEM_DIMENSION +
            Macchi3.GEM_DIMENSION / 2
        }, Macchi3.SWAP_SPEED, Phaser.Easing.Linear.None, true);
    var orb2Tween = Macchi3.game.add.tween(
      Macchi3.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbSprite)
        .to({
          x: this.getOrbCol(orb2) * Macchi3.GEM_DIMENSION +
            Macchi3.GEM_DIMENSION / 2,
          y: this.getOrbRow(orb2) * Macchi3.GEM_DIMENSION +
            Macchi3.GEM_DIMENSION / 2
        }, Macchi3.SWAP_SPEED, Phaser.Easing.Linear.None, true);
    orb2Tween.onComplete.add(function() {
      if (!this.matchInBoard() && swapBack) {
        this.swapOrbs(orb1, orb2, false);
      } else if (this.matchInBoard()) {
        this.handleMatches();
      } else {
        Macchi3.canSelect = true;
        Macchi3.selectedOrb = null;
      }
    }.bind(this));
  },

  areNext: function(orb1, orb2) {
    return Math.abs(this.getOrbRow(orb1) - this.getOrbRow(orb2)) +
      Math.abs(this.getOrbCol(orb1) - this.getOrbCol(orb2)) ===
      1;
  },

  areTheSame: function(orb1, orb2) {
    return this.getOrbRow(orb1) === this.getOrbRow(orb2) &&
      this.getOrbCol(orb1) === this.getOrbCol(orb2);
  },

  gemAt: function(row, col) {
    if (row < 0 || row >= Macchi3.BOARD_DIMENSION ||
      col < 0 || col >= Macchi3.BOARD_DIMENSION) {
      return -1;
    }
    return Macchi3.gameArray[row][col];
  },

  getOrbRow: function(orb) {
    return Math.floor(orb.orbSprite.y / Macchi3.GEM_DIMENSION);
  },

  getOrbCol: function(orb) {
    return Math.floor(orb.orbSprite.x / Macchi3.GEM_DIMENSION);
  },

  isHorizontalMatch: function(row, col) {
    return (this.gemAt(row, col).orbColor ===
      this.gemAt(row, col - 1).orbColor) &&
      (this.gemAt(row, col).orbColor ===
      this.gemAt(row, col - 2).orbColor);
  },

  isVerticalMatch: function(row, col) {
    return (this.gemAt(row, col).orbColor ===
      this.gemAt(row - 1, col).orbColor) &&
      (this.gemAt(row, col).orbColor ===
      this.gemAt(row - 2, col).orbColor);
  },

  isMatch: function(row, col) {
    return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
  },

  matchInBoard: function() {
    for (let i = 0; i < Macchi3.BOARD_DIMENSION; i++) {
      for (let j = 0; j < Macchi3.BOARD_DIMENSION; j++) {
        if (this.isMatch(i, j)) {
          return true;
        }
      }
    }
    return false;
  },

  handleMatches: function() {
    // console.trace();
    Macchi3.removeMap = [];
    for (let i = 0; i < Macchi3.BOARD_DIMENSION; i++) {
      Macchi3.removeMap[i] = [];
      for (let j = 0; j < Macchi3.BOARD_DIMENSION; j++) {
        Macchi3.removeMap[i].push(0);
      }
    }
    // console.log(Macchi3.GameState);
    if (this.handleHorizontalMatches === undefined) {
      console.log("I hate you");
      Macchi3.GameState.prototype.handleHorizontalMatches();
      Macchi3.GameState.prototype.handleVerticalMatches();
      Macchi3.GameState.prototype.destroyOrbs();
    } else {
      this.handleHorizontalMatches();
      this.handleVerticalMatches();
      this.destroyOrbs();
      console.log("<3");
    }
  },

  handleVerticalMatches: function() {
    for (let i = 0; i < Macchi3.BOARD_DIMENSION; i++) {
      var colorStreak = 1;
      var currentColor = -1;
      var startStreak = 0;
      for (let j = 0; j < Macchi3.BOARD_DIMENSION; j++) {
        if (this.gemAt(j, i).orbColor === currentColor) {
          colorStreak++;
        }
        if (this.gemAt(j, i).orbColor !== currentColor ||
          j === Macchi3.BOARD_DIMENSION - 1) {
          if (colorStreak >= 3) {
            console.log("VERTICAL :: Length = " + colorStreak +
              " :: Start = (" + startStreak +
              "," + i + ") :: Color = " + currentColor);
            for (let k = 0; k < colorStreak; k++) {
              Macchi3.removeMap[startStreak + k][i]++;
            }
          }
          startStreak = j;
          colorStreak = 1;
          currentColor = this.gemAt(j, i).orbColor;
        }
      }
    }
  },

  handleHorizontalMatches: function() {
    for (let i = 0; i < Macchi3.BOARD_DIMENSION; i++) {
      var colorStreak = 1;
      var currentColor = -1;
      var startStreak = 0;
      for (let j = 0; j < Macchi3.BOARD_DIMENSION; j++) {
        if (this.gemAt(i, j).orbColor === currentColor) {
          colorStreak++;
        }
        if (this.gemAt(i, j).orbColor !== currentColor ||
          j === Macchi3.BOARD_DIMENSION - 1) {
          if (colorStreak >= 3) {
            console.log("HORIZONTAL :: Length = " + colorStreak +
            " :: Start = (" + i + "," + startStreak +
            ") :: Color = " + currentColor);
            for (let k = 0; k < colorStreak; k++) {
              Macchi3.removeMap[i][startStreak + k]++;
            }
          }
          startStreak = j;
          colorStreak = 1;
          currentColor = this.gemAt(i, j).orbColor;
        }
      }
    }
  },

  destroyOrbs: function() {
    console.log(this);
    var destroyed = 0;
    for (let i = 0; i < Macchi3.BOARD_DIMENSION; i++) {
      for (let j = 0; j < Macchi3.BOARD_DIMENSION; j++) {
        if (Macchi3.removeMap[i][j] > 0) {
          var destroyTween = Macchi3.game.add.tween(
            Macchi3.gameArray[i][j].orbSprite).to({
              alpha: 0
            }, Macchi3.DESTROY_SPEED, Phaser.Easing.Linear.None, true);
          destroyed++;
          destroyTween.onComplete.add(function(orb) {
            orb.destroy();
            destroyed--;
            if (destroyed === 0) {
              this.makeOrbsFall();
              if (Macchi3.FAST_FALL) {
                this.replenishField();
              }
            }
          }.bind(this));
          Macchi3.gameArray[i][j] = null;
        }
      }
    }
  },

  makeOrbsFall: function() {
    var fallen = 0;
    var restart = false;
    for (let i = Macchi3.BOARD_DIMENSION - 2; i >= 0; i--) {
      for (let j = 0; j < Macchi3.BOARD_DIMENSION; j++) {
        if (Macchi3.gameArray[i][j]) {
          var fallTiles = this.holesBelow(i, j);
          if (fallTiles > 0) {
            if (!Macchi3.FAST_FALL && fallTiles > 1) {
              fallTiles = 1;
              restart = true;
            }
            var orb2Tween = Macchi3.game.add.tween(
              Macchi3.gameArray[i][j].orbSprite).to({
                y: Macchi3.gameArray[i][j].orbSprite.y +
                  fallTiles * Macchi3.GEM_DIMENSION
              }, Macchi3.FALL_SPEED, Phaser.Easing.Linear.None, true);
            fallen++;
            orb2Tween.onComplete.add(function() {
              fallen--;
              if (fallen === 0) {
                if (restart) {
                  this.makeOrbsFall();
                } else if (!Macchi3.FAST_FALL) {
                  this.replenishField();
                }
              }
            }.bind(this));
            Macchi3.gameArray[i + fallTiles][j] = {
              orbSprite: Macchi3.gameArray[i][j].orbSprite,
              orbColor: Macchi3.gameArray[i][j].orbColor
            };
            Macchi3.gameArray[i][j] = null;
          }
        }
      }
    }
    if (fallen === 0) {
      this.replenishField();
    }
  },

  replenishField: function() {
    var replenished = 0;
    var restart = false;
    for (let j = 0; j < Macchi3.BOARD_DIMENSION; j++) {
      var emptySpots = this.holesInCol(j);
      if (emptySpots > 0) {
        if (!Macchi3.FAST_FALL && emptySpots > 1) {
          emptySpots = 1;
          restart = true;
        }
        for (let i = 0; i < emptySpots; i++) {
          var orb = Macchi3.game.add.sprite(
            Macchi3.GEM_DIMENSION * j + Macchi3.GEM_DIMENSION / 2,
            -(Macchi3.GEM_DIMENSION * (emptySpots - 1 - i) +
            Macchi3.GEM_DIMENSION / 2),
            "gems_spritesheet");
          orb.anchor.set(0.5);
          Macchi3.orbGroup.add(orb);
          var randomColor = Macchi3.game.rnd.between(
            0,
            Macchi3.NUM_GEM_GROUPS - 1);
          orb.frame = randomColor;
          Macchi3.gameArray[i][j] = {
            orbColor: randomColor,
            orbSprite: orb
          };
          var orb2Tween = Macchi3.game.add.tween(
            Macchi3.gameArray[i][j].orbSprite).to({
              y: Macchi3.GEM_DIMENSION * i + Macchi3.GEM_DIMENSION / 2
            }, Macchi3.FALL_SPEED, Phaser.Easing.Linear.None, true);
          replenished++;
          orb2Tween.onComplete.add(function() {
            replenished--;
            if (replenished === 0) {
              if (restart) {
                this.makeOrbsFall();
              } else if (this.matchInBoard()) {
                Macchi3.game.time.events.add(250, this.handleMatches);
              } else {
                Macchi3.canSelect = true;
                Macchi3.selectedOrb = null;
              }
            }
          }.bind(this));
        }
      }
    }
  },

  holesBelow: function(row, col) {
    var result = 0;
    for (let i = row + 1; i < Macchi3.BOARD_DIMENSION; i++) {
      if (!Macchi3.gameArray[i][col]) {
        result++;
      }
    }
    return result;
  },

  holesInCol: function(col) {
    var result = 0;
    for (let i = 0; i < Macchi3.BOARD_DIMENSION; i++) {
      if (!Macchi3.gameArray[i][col]) {
        result++;
      }
    }
    return result;
  }
};
