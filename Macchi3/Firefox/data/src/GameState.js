/* With thanks to http://www.emanueleferonato.com/2016/05/17/match-3-bejeweled-html5-prototype-made-with-phaser/ */

Macchi3.GameState = function(game) {
  this.colorGroupIsOn = true;
  this.currCharacterArray = [];
  this.gameArray = [];
  this.removeMap = [];
  this.orbGroup = {};
  this.selectedOrb = {};
  this.canSelect = false;
  this.score = 0;
  this.scoreText = "";
  this.NUM_GEM_GROUPS = 6;
  this.SWAP_SPEED = 200;
  this.FALL_SPEED = 1000;
  this.DESTROY_SPEED = 500;
  this.FAST_FALL = true;
};

Macchi3.GameState.prototype = {
  create: function() {
    this.drawField();
    this.canSelect = true;
    this.input.onDown.add(this.orbSelect.bind(this));
    this.input.onUp.add(this.orbDeselect.bind(this));
  },

  update: function() {
  },

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffle: function(arr) {
    var currentIndex = arr.length
    var temporaryValue;
    var randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
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
    this.state.start("GameoverState");
  },

  drawField: function() {
    this.orbGroup = this.add.group();
    for (let i = 0; i < BOARD_DIMENSION; i++) {
      this.gameArray[i] = [];
      for (let j = 0; j < BOARD_DIMENSION; j++) {
        var orb = this.add.sprite(
          GEM_DIMENSION * j + GEM_DIMENSION / 2,
          GEM_DIMENSION * i + GEM_DIMENSION / 2,
          "gems_spritesheet");
        orb.anchor.set(0.5);
        this.orbGroup.add(orb);
        do {
          var randomColor = this.rnd.between(0, this.NUM_GEM_GROUPS - 1);
          orb.frame = randomColor;
          this.gameArray[i][j] = {
            orbColor: randomColor,
            orbSprite: orb
          };
        } while (this.isMatch(i, j));
      }
    }
    this.selectedOrb = null;
  },

  orbSelect: function(e) {
    if (this.canSelect) {
      var row = Math.floor(e.clientY / GEM_DIMENSION);
      var col = Math.floor(e.clientX / GEM_DIMENSION);
      var pickedOrb = this.gemAt(row, col);
      if (pickedOrb != -1) {
        if (!this.selectedOrb) {
          pickedOrb.orbSprite.scale.setTo(1.2);
          pickedOrb.orbSprite.bringToTop();
          this.selectedOrb = pickedOrb;
          // this.input.addMoveCallback(this.orbMove.bind(this));
        } else {
          if (this.areTheSame(pickedOrb, this.selectedOrb)) {
            this.selectedOrb.orbSprite.scale.setTo(1);
            this.selectedOrb = null;
          } else {
            if (this.areNext(pickedOrb, this.selectedOrb)) {
              this.selectedOrb.orbSprite.scale.setTo(1);
              this.swapOrbs(this.selectedOrb, pickedOrb, true);
            } else {
              this.selectedOrb.orbSprite.scale.setTo(1);
              pickedOrb.orbSprite.scale.setTo(1.2);
              this.selectedOrb = pickedOrb;
              // this.input.addMoveCallback(this.orbMove.bind(this));
            }
          }
        }
      }
    }
  },

  orbDeselect: function(e) {
    // console.log(this);
    // this.input.deleteMoveCallback(this.orbMove.bind(this));
  },

  orbMove: function(event, pX, pY) {
    if (event.id === 0) {
      var distX = pX - this.selectedOrb.orbSprite.x;
      var distY = pY - this.selectedOrb.orbSprite.y;
      var deltaRow = 0;
      var deltaCol = 0;
      if (Math.abs(distX) > GEM_DIMENSION / 2) {
        if (distX > 0) {
          deltaCol = 1;
        } else {
          deltaCol = -1;
        }
      } else {
        if (Math.abs(distY) > GEM_DIMENSION / 2) {
          if (distY > 0) {
            deltaRow = 1;
          } else {
            deltaRow = -1;
          }
        }
      }
      if (deltaRow + deltaCol !== 0) {
        var pickedOrb = this.gemAt(
          this.getOrbRow(this.selectedOrb) + deltaRow,
          this.getOrbCol(this.selectedOrb) + deltaCol);
        if (pickedOrb != -1) {
          this.selectedOrb.orbSprite.scale.setTo(1);
          this.swapOrbs(this.selectedOrb, pickedOrb, true);
          // this.input.deleteMoveCallback(this.orbMove.bind(this));
        }
      }
    }
  },

  swapOrbs: function(orb1, orb2, swapBack) {
    this.canSelect = false;
    var fromColor = orb1.orbColor;
    var fromSprite = orb1.orbSprite;
    var toColor = orb2.orbColor;
    var toSprite = orb2.orbSprite;
    this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)]
      .orbColor = toColor;
    this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)]
      .orbSprite = toSprite;
    this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)]
      .orbColor = fromColor;
    this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)]
      .orbSprite = fromSprite;
    var orb1Tween = this.add.tween(
      this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbSprite).to({
        x: this.getOrbCol(orb1) * GEM_DIMENSION + GEM_DIMENSION / 2,
        y: this.getOrbRow(orb1) * GEM_DIMENSION + GEM_DIMENSION / 2
      }, this.SWAP_SPEED, Phaser.Easing.Linear.None, true);
    var orb2Tween = this.add.tween(
      this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbSprite).to({
        x: this.getOrbCol(orb2) * GEM_DIMENSION + GEM_DIMENSION / 2,
        y: this.getOrbRow(orb2) * GEM_DIMENSION + GEM_DIMENSION / 2
      }, this.SWAP_SPEED, Phaser.Easing.Linear.None, true);
    orb2Tween.onComplete.add(function() {
      if (!this.matchInBoard() && swapBack) {
        this.swapOrbs(orb1, orb2, false);
      } else {
        if (this.matchInBoard()) {
          this.handleMatches();
        } else {
          this.canSelect = true;
          this.selectedOrb = null;
        }
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
    if (row < 0 || row >= BOARD_DIMENSION ||
      col < 0 || col >= BOARD_DIMENSION) {
      return -1;
    }

    // console.log(window.Macchi3);
    if (!this.gameArray) {
      console.log(this);
      console.trace();
      return this.prototype.gameArray[row][col];
    } else {
      // console.log(this);
      return this.gameArray[row][col];
    }
  },

  getOrbRow: function(orb) {
    return Math.floor(orb.orbSprite.y / GEM_DIMENSION);
  },

  getOrbCol: function(orb) {
    return Math.floor(orb.orbSprite.x / GEM_DIMENSION);
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
    return this.isHorizontalMatch(row, col) ||
    this.isVerticalMatch(row, col);
  },

  matchInBoard: function() {
    for (let i = 0; i < BOARD_DIMENSION; i++) {
      for (let j = 0; j < BOARD_DIMENSION; j++) {
        if (this.isMatch(i, j)) {
          return true;
        }
      }
    }
    return false;
  },

  handleMatches: function() {
    // console.trace();
    this.removeMap = [];
    for (let i = 0; i < BOARD_DIMENSION; i++) {
      this.removeMap[i] = [];
      for (let j = 0; j < BOARD_DIMENSION; j++) {
        this.removeMap[i].push(0);
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
    for (let i = 0; i < BOARD_DIMENSION; i++) {
      var colorStreak = 1;
      var currentColor = -1;
      var startStreak = 0;
      for (let j = 0; j < BOARD_DIMENSION; j++) {
        if (this.gemAt(j, i).orbColor === currentColor) {
          colorStreak++;
        }
        if (this.gemAt(j, i).orbColor !== currentColor ||
          j === BOARD_DIMENSION - 1) {
          if (colorStreak >= 3) {
            console.log("VERTICAL :: Length = " + colorStreak +
              " :: Start = (" + startStreak +
              "," + i + ") :: Color = " + currentColor);
            for (let k = 0; k < colorStreak; k++) {
              this.removeMap[startStreak + k][i]++;
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
    for (let i = 0; i < BOARD_DIMENSION; i++) {
      var colorStreak = 1;
      var currentColor = -1;
      var startStreak = 0;
      for (let j = 0; j < BOARD_DIMENSION; j++) {
        if (this.gemAt(i, j).orbColor === currentColor) {
          colorStreak++;
        }
        if (this.gemAt(i, j).orbColor !== currentColor ||
          j === BOARD_DIMENSION - 1) {
          if (colorStreak >= 3) {
            console.log("HORIZONTAL :: Length = " + colorStreak +
            " :: Start = (" + i + "," + startStreak +
            ") :: Color = " + currentColor);
            for (let k = 0; k < colorStreak; k++) {
              this.removeMap[i][startStreak + k]++;
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
    var destroyed = 0;
    for (let i = 0; i < BOARD_DIMENSION; i++) {
      for (let j = 0; j < BOARD_DIMENSION; j++) {
        if (this.removeMap[i][j] > 0) {
          var destroyTween = this.add.tween(this.gameArray[i][j].orbSprite).to({
            alpha: 0
          }, this.DESTROY_SPEED, Phaser.Easing.Linear.None, true);
          destroyed++;
          destroyTween.onComplete.add(function(orb) {
            orb.destroy();
            destroyed--;
            if (destroyed === 0) {
              this.makeOrbsFall();
              if (this.FAST_FALL) {
                this.replenishField();
              }
            }
          }.bind(this));
          this.gameArray[i][j] = null;
        }
      }
    }
  },

  makeOrbsFall: function() {
    var fallen = 0;
    var restart = false;
    for (let i = BOARD_DIMENSION - 2; i >= 0; i--) {
      for (let j = 0; j < BOARD_DIMENSION; j++) {
        if (this.gameArray[i][j]) {
          var fallTiles = this.holesBelow(i, j);
          if (fallTiles > 0) {
            if (!this.FAST_FALL && fallTiles > 1) {
              fallTiles = 1;
              restart = true;
            }
            var orb2Tween = this.add.tween(this.gameArray[i][j].orbSprite).to({
              y: this.gameArray[i][j].orbSprite.y + fallTiles * GEM_DIMENSION
            }, this.FALL_SPEED, Phaser.Easing.Linear.None, true);
            fallen++;
            orb2Tween.onComplete.add(function() {
              fallen--;
              if (fallen === 0) {
                if (restart) {
                  this.makeOrbsFall();
                } else {
                  if (!this.FAST_FALL) {
                    this.replenishField();
                  }
                }
              }
            }.bind(this));
            this.gameArray[i + fallTiles][j] = {
              orbSprite: this.gameArray[i][j].orbSprite,
              orbColor: this.gameArray[i][j].orbColor
            };
            this.gameArray[i][j] = null;
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
    for (let j = 0; j < BOARD_DIMENSION; j++) {
      var emptySpots = this.holesInCol(j);
      if (emptySpots > 0) {
        if (!this.FAST_FALL && emptySpots > 1) {
          emptySpots = 1;
          restart = true;
        }
        for (let i = 0; i < emptySpots; i++) {
          var orb = this.add.sprite(
            GEM_DIMENSION * j + GEM_DIMENSION / 2,
            -(GEM_DIMENSION * (emptySpots - 1 - i) + GEM_DIMENSION / 2),
            "gems_spritesheet");
          orb.anchor.set(0.5);
          this.orbGroup.add(orb);
          var randomColor = this.rnd.between(0, this.NUM_GEM_GROUPS - 1);
          orb.frame = randomColor;
          this.gameArray[i][j] = {
            orbColor: randomColor,
            orbSprite: orb
          };
          var orb2Tween = this.add.tween(this.gameArray[i][j].orbSprite).to({
            y: GEM_DIMENSION * i + GEM_DIMENSION / 2
          }, this.FALL_SPEED, Phaser.Easing.Linear.None, true);
          replenished++;
          orb2Tween.onComplete.add(function() {
            replenished--;
            if (replenished === 0) {
              if (restart) {
                this.makeOrbsFall();
              }
              else {
                if (this.matchInBoard()) {
                  this.time.events.add(250, this.handleMatches);
                }
                else {
                  this.canSelect = true;
                  this.selectedOrb = null;
                }
              }
            }
          }.bind(this));
        }
      }
    }
  },

  holesBelow: function(row, col) {
    var result = 0;
    for (let i = row + 1; i < BOARD_DIMENSION; i++) {
      if (!this.gameArray[i][col]) {
        result++;
      }
    }
    return result;
  },

  holesInCol: function(col) {
    var result = 0;
    for (let i = 0; i < BOARD_DIMENSION; i++) {
      if (!this.gameArray[i][col]) {
        result++;
      }
    }
    return result;
  }
};
