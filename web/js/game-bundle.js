(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.module = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
/* 
 * Copyright (C) 2018 wcs <wcs at willicommer.de>
 *
 */


/**
 * Stores X,Y coordinates
 * @constructor
 */
class Pos {

  /**
   * 
   * @param {...args} args see $assign for optional parameter
   * @returns {Pos}
   */
  
  constructor  (...args) {
    this.assign.apply(this, args);
  }

/**
 * assign(1,2) or assign('1-2') or assign(new Pos(1,2))
 * @param {type} args
 *   */
  assign (...args) {
    
    if (args.length >= 2) {
      this.x = args[0];
      this.y = args[1];
      return;
    }

    if (args.length === 1) {
      if (args[0] instanceof Pos) {
        this.x = args[0].x;
        this.y = args[0].y;
        return;
      }
      if (typeof args[0] === 'string') {
        this.key = args[0];
        return;
      }
    }

    this.x = 0;
    this.y = 0;
  }


  /**
   * @returns {String} a key like '5-6'
   */
  get key()  { 
    return this.x + '-' + this.y; 
  }


  /** set key for position will change x and y
   * @param {string} s
   */
  set key(s) {
    var a = s.split('-');
    this.x = parseInt(a[0]);
    this.y = parseInt(a[1]);
  }  
  
  get left()    { return new Pos(this.x-1, this.y); }
  get right()   { return new Pos(this.x+1, this.y); }
  get top()     { return new Pos(this.x,   this.y-1); }
  get bottom()  { return new Pos(this.x,   this.y+1); }
  
  /**
   * compare with a Pos
   * @param {Pos} pos
   * @returns {Boolean} true if pos is equal to this
   */
  eq (pos) { return (this.x === pos.x) && (this.y === pos.y); }
  
}



/**
 * Game Board a 2 dimensional array to hold integers in each cell
 * @constructor
 */
class Board {
  
  /**
   * @param {integer} cols
   * @param {integer} rows
   * @param {type} initial a interger or function to fill the board
   * @returns {undefined}
   */
  constructor (cols, rows, initial = 0) {
    this.setSize(cols, rows, initial);
  }
  
  setSize (cols, rows, initial = 0) {
    this._a = new Array(rows);
    this.cols = cols;
    this.rows = rows;
    for(let i=0; i < this.rows; ++i)
      this._a[i] = new Array(this.cols);
    this.fill(initial);
  }

  /**
   * @param {integer} col
   * @param {integer} row
   * @returns {integer} content of board cell
   */
  get (col, row) {
    return this._a[row][col];
  };
  
  /**
   * @param {integer} col
   * @param {integer} row
   * @param {integer} val
   */
  set (col, row, val) {
    this._a[row][col] = val;
  };

  /**
   * @param {Pos} pos
   * @returns {integer}
   */
  getPos (pos) { return this._a[pos.y][pos.x]; }
  
  /**
   * @param {Pos} pos
   * @param {integer} val
   */
  setPos (pos, val) { this._a[pos.y][pos.x] = val; }

  /**
   * iterate through all cells
   * @param {function} callback( item, x, y)
   */
  forEach (callback) {           
    for(let r=0; r < this.rows; ++r)
      for(let c=0; c < this.cols; ++c) 
        callback(this._a[r][c], c, r);
  }

  /**
   * @param {function} filter = function( {pos,value} ) { return boolean }    
   * @returns {Object} board as object {{pos: {x:0,y:0}, val: 1},..}
   */
  getHash (filter) {
    var result = {};
    for(let r=0; r < this.rows; ++r)
      for(let c=0; c < this.cols; ++c) {
        var pos = new Pos(c,r);
        var obj = {
          "pos": pos,
          "val": this.getPos(pos)
        };
        if ((filter === undefined) || filter(obj))
          result[obj.pos.key] = obj;
      }
    return result;
  }

  /**
   * @param {type} value integer or function(x,y)
   * @returns {Array} array of Pos of cells contains value
   */
  getPosList (value) {
    var result = [];
    for(let r=0; r < this.rows; ++r)
      for(let c=0; c < this.cols; ++c) {
        if ((value === undefined) || (value === this.get(c,r)))
          result.push(new Pos(c,r));
      }
    return result;
  }
  
  /**
   * @param {type} value integer or function(x,y)
   */
  fill (value) {
    for(let r=0; r < this.rows; ++r)
      for(let c=0; c < this.cols; ++c) {
        if(typeof value === 'function') {
          this._a[r][c] = value(c,r);
        } else {
          this._a[r][c] = value;
        }  
      }
  }  
  
  clone () { 
//    return new Board(this.cols, this.rows, this.get.bind(this)); 
    var result = new Board(this.cols, this.rows); 
    for(let r=0; r < this.rows; ++r)
      for(let c=0; c < this.cols; ++c) 
        result._a[r][c] = this._a[r][c];
    return result;
  }

  /**
   * @param {Pos} pos
   * @returns {Boolean} true if pos is inside board dimensions
   */
  validPos (pos) {
    return (pos.x >= 0) && (pos.x < this.cols) && (pos.y >= 0) && (pos.y < this.rows);
  }
  
  /**
   * @param {Pos} fromPos
   * @param {Pos} toPos
   */
  move (fromPos, toPos) {
    this.setPos(toPos, this.getPos(fromPos));
    this.setPos(fromPos, 0);
  }
  
  /**
   * @param {Pos} pos
   * @returns {Array} array of Pos with neigbour cells
   */
  neighbours (pos) {
    var a = [];
    var p = pos.left;
    if (this.validPos(p)) a.push(p);
    p = pos.top; if (this.validPos(p)) a.push(p);
    p = pos.right; if (this.validPos(p)) a.push(p);
    p = pos.bottom; if (this.validPos(p)) a.push(p);
    return a;
  }
  
  floodFill (pos, matchfunc, matches, checked ) {
    if (!this.validPos(pos)) return;
    if (checked  === undefined) checked = [];
    if (checked.indexOf(pos.key) >= 0) return;
    checked.push(pos.key);
    if (!matchfunc(pos)) return;
    matches.push(pos);
    this.floodFill( pos.left,   matchfunc, matches, checked);
    this.floodFill( pos.right,  matchfunc, matches, checked);
    this.floodFill( pos.top,    matchfunc, matches, checked);
    this.floodFill( pos.bottom, matchfunc, matches, checked);
  }

  /**
   * Collect positions with neighbours of the same value
   * @param {Pos} startPos
   * @param {integer} members alternative array of integer
   * @param {Boolean} exclusive eclude Pos if true
   * @returns {Array} array of Pos
   */
  getCluster( startPos, members, exclusive ) {      
    var board = this;
    if (members === undefined) members = [board.getPos(startPos)];
    if (typeof members === 'number') members = [members];
    var result = [];
    this.floodFill( startPos, filter, result );
    return result;
    
    function filter(pos) {
     if (!exclusive && pos.eq(startPos)) return true;
     return members.indexOf(board.getPos(pos)) >= 0;
    }
  }

  /**
   * Return board as string
   * @returns {string}
   */
  toString () {
    var result = '';
    // rows
    for(let r = 0; r < this.rows; ++r) {
      for(let c = 0; c < this.cols; ++c) {
        var f = '' + this._a[r][c];
        if (f.length === 1) f += ' ';
        result += f ;
      }  
      result += '\n';
    }
    return result;
  };

  /**
   * Return board as string with frame 
   * @returns {string}
   */
  toStringFramed () {
    var result = '';
    result += '   ';
    // header
    for(let c = 0; c < this.cols; ++c)
      result += c + ' ';
    result += '\n';
    result += '---';
    for(let c = 0; c < this.cols; ++c)
      result += '--';
    result += '\n';
    // rows
    for(let r = 0; r < this.rows; ++r) {
      result += r + '| ';
      for(let c = 0; c < this.cols; ++c) {
        var f = '' + this._a[r][c];
        if (f === '0') f = ' ';
        result += f + ' ';
      }  
      result += '\n';
    }
    return result;
  };

  /**
   * Set board as string. String must have the same format as toString(). Board size will not change.
   * @param {string} s
   */
  setString (s) {
    if (!s) return;
    var sr = s.split('\n');
    var sc;
    // rows
    var maxR = sr.length > this.rows ? this.rows : sr.length;
    for(let r = 0; r < maxR; ++r) {
      sc = sr[r];
      var maxC = sc.length > this.cols ? this.cols : sc.length;
      for(let c = 0; c < maxC; ++c) {
        var f = sc[c];
        f = sc.substr(c*2,2).trim();
        if (f === '') f = '0';
        this._a[r][c] = parseInt(f);
      }  
    }
  };
  
}


module.exports = { Pos: Pos, Board: Board  };



},{}],2:[function(require,module,exports){
/* 
 * Triple Game configuration
 */

var configList = [
  require('./config/default.js'),
  require('./config/test.js')
];


module.exports = {
  configList:         configList,
  defaultConfig:      configList[0]
};


},{"./config/default.js":3,"./config/test.js":4}],3:[function(require,module,exports){
/*
 * 
 */


const {TRIPLE_FIG} = require('../figures.js');

module.exports = Object({
  
  name: 'Standard Game',
  description: 'Standard Game\nboard: 6 x 6\n6 random figures at start',
  
  board_size:     {x: 6, y:6},
  board:          null,
  state:          null,
  logger:         false,

  // number of initial random figures 
  initial_count:  6,

  // new game figures
  initial_figures: [
  //[ figure,           probability % ]  
    [ TRIPLE_FIG.GRASS,           60  ],
    [ TRIPLE_FIG.BUSH,            15  ],
    [ TRIPLE_FIG.TREE,            2   ],
    [ TRIPLE_FIG.HUT,             0.6 ],
    [ TRIPLE_FIG.BEAR,            2.5 ],
    [ TRIPLE_FIG.ROCK,            2.5 ]
  ],
  
  // next figure while playing 
  next_figures: [
  //[ figure,           probability % ]  
    [ TRIPLE_FIG.GRASS,           60  ],
    [ TRIPLE_FIG.BUSH,            15  ],
    [ TRIPLE_FIG.TREE,            2   ],
    [ TRIPLE_FIG.HUT,             0.6 ],
    [ TRIPLE_FIG.BEAR,            2.5 ],
    [ TRIPLE_FIG.CRYSTAL,         2.5 ],
    [ TRIPLE_FIG.ROBOT,           2.5 ],
    [ TRIPLE_FIG.NINJA,           0.5 ]
  ]
  
});




},{"../figures.js":5}],4:[function(require,module,exports){
/*
 * 
 */


const {TRIPLE_FIG} = require('../figures.js');

module.exports = () => new Object({
  
  name: 'test 1',
  description: 'use initial board, hut,bear,crystal,rock ',
  
  board_size:     {x: 4, y:6},
  board:          
    '200 0 7 \n' +
    '0 200 0 \n' +
    '0 0 200 \n' +
    '0 0 0 20\n' +
    '0 0 0 0 \n' +
    '300 0 0 \n',

  next_figure:    TRIPLE_FIG.ROBOT,
  reserve:        0,
  total_score:    0,
  total_gold:     0,
  
  ondo:           null,
  logger:         false,

  // number of initial random figures 
  initial_count:  0,
  
  // new game figures
  initial_figures: [
  //[ figure,           probability % ]  
  ],
  
  // next figure while playing 
  next_figures: [
  //[ figure,           probability % ]  
    [ TRIPLE_FIG.HUT,             20  ],
    [ TRIPLE_FIG.BEAR,            5   ],
    [ TRIPLE_FIG.CRYSTAL,         10  ],
    [ TRIPLE_FIG.ROCK,             5  ],
    [ TRIPLE_FIG.ROBOT,           10  ]
  ]
  
});


},{"../figures.js":5}],5:[function(require,module,exports){
/* 
 * Copyright (C) 2018 wcs <wcs at willicommer.de>
 *
 */

/**
 * triple figure definitions
 * 
 * 
 * each figure (object or item) has an integer id. Use the symbols in TRIPLE_FIG.
 * 
 * Figure properties are in 'var figures'. 
 * use function figureProp() to retrieve figure property. Example:
 *    score = figureProp(TRIPLE_FIG.GRASS).score;
 * 
 */ 



/** figure id definition */

const TRIPLE_FIG = {
  EMPTY:              0,
  GRASS:              1,
  BUSH:               2,
  TREE:               3,
  HUT:                4,
  HOUSE:              5,
  MANSION:            6,
  CASTLE:             7,
  FLOATINGCASTLE:     8,
  TRIPLECASTLE:       9,
  ROCK:               20,
  MOUNTAIN:           21,
  ROBOT:              25,
  CRYSTAL:            26,
  BEAR:               30,
  TOMB:               31,
  NINJA:              32,
  CHURCH:             40,
  CATHEDRAL:          41,
  TREASURE:           50,
  BIGTREASURE:        51,

  SUPER:              100,
  SUPERBUSH:          102,   // SUPER + BUSH
  SUPERTREE:          103,   // SUPER + TREE 
  SUPERHUT:           104,
  SUPERHOUSE:         105,
  SUPERMENSION:       106,
  SUPERCASTLE:        107,
  NONE:               0
};


/** 
 * list of objects with figure properties
 * @namespace
 * @property {object}  fig                    - figure properties
 * @property {number}  fig.id                 - TRIPLE_FIG value
 * @property {string}  fig.key                - id as string
 * @property {string}  fig.name               - name
 * @property {number}  fig.score              - score for placing
 * @property {number}  fig.gold               - used for treasure (optional)
 * @property {number}  fig.growto             - id of figure to grow to (optional)
 * @property {number}  fig.destroyto          - id of figure when it is killed (optional)
 * @property {string}  fig.img                - name of image file
 * @property {number}  fig.probability        - probability to appear in percent
 * @property {number}  fig.cost               - price in shop
 * 
 */

var figureList = [ 

  { name: 'default',
    score: 0,
    growto: 0,
    destroyto: 0,
    gold: 0,
    key: '',
    id: -1,
    img: 'none' },
  
  { name: 'Empty',
    score: 0,
    growto: 0,
    id: 0,
    key: '0',
    img: 'empty' },
  
  { name: 'Grass',
    score: 5,
    growto: 2,
    probability: 60,
    cost: 100,
    id: 1,
    key: '1',
    img: 'grass' },
  
  { name: 'Bush',
    score: 20,
    growto: 3,
    probability: 15,
    cost: 150,
    id: 2,
    key: '2',
    img: 'bush' },
  
  { name: 'Tree',
    score: 100,
    growto: 4,
    probability: 2,
    cost: 400,
    id: 3,
    key: '3',
    img: 'tree' },
  
  { name: 'Hut',
    score: 500,
    growto: 5,
    probability: 0.6,
    cost: 400,
    id: 4,
    key: '4',
    img: 'hut' },
  
  { name: 'House',
    score: 1500,
    growto: 6,
    probability: 0.3,
    id: 5,
    key: '5',
    img: 'house' },
  
  { name: 'Menison',
    score: 5000,
    growto: 7,
    id: 6,
    key: '6',
    img: 'menison' },
  { name: 'Castle',
    
    score: 20000,
    growto: 8,
    id: 7,
    key: '7',
    img: 'castle' },
  
  { name: 'Floating Castle',
    score: 100000,
    growto: 9,
    id: 8,
    key: '8',
    img: 'floatingcastle' },
  
  { name: 'Triple Castle',
    score: 200000,
    id: 9,
    key: '9',
    img: 'triplecastle' },
  
  { name: 'Rock',
    score: 500,
    growto: 21,
    probability: 2.5,
    id: 20,
    key: '20',
    img: 'rock' },
  
  { name: 'Mountain',
    score: 1000,
    growto: 51,
    destroyto: 50,
    id: 21,
    key: '21',
    img: 'mountain' },
  
  { name: 'Robot',
    score: 10,
    probability: 2.5,
    cost: 1000,
    id: 25,
    key: '25',
    img: 'robot' },
  
  { name: 'Crystal',
    score: 10,
    probability: 2.5,
    cost: 1500,
    id: 26,
    key: '26',
    img: 'crystal' },
  
  { name: 'Bear',
    score: 50,
    destroyto: 31,
    probability: 2.5,
    id: 30,
    key: '30',
    img: 'bear' },
  
  { name: 'Tomb',
    score: 50,
    growto: 40,
    id: 31,
    key: '31',
    img: 'tomb' },
  
  { name: 'Ninja',
    score: 50,
    destroyto: 31,
    probability: 1.5,
    id: 32,
    key: '32',
    img: 'ninja' },
  
  { name: 'Church',
    score: 1000,
    growto: 41,
    id: 40,
    key: '40',
    img: 'church' },
  
  { name: 'Cathedral',
    score: 5000,
    growto: 50,
    id: 41,
    key: '41',
    img: 'cathedral' },
  
  { name: 'Treasure',
    score: 5,
    growto: 51,
    gold: 500,
    id: 50,
    key: '50',
    img: 'treasure' },
  
  { name: 'Treasure',
    score: 10,
    gold: 1500,
    id: 51,
    key: '51',
    img: 'treasure' } 
];



function generateFigureHash (list){
  let result = {};
  for (let i=0; i < list.length; i++){
    result[list[i].key] = list[i];
  }
  return result;
}

/** figures is a hash fof figureList */
var figures = generateFigureHash(figureList);

/**
 * Get figure by id
 * @param {type} f figure id (key)
 * @returns {nm$_figures.figures} figure properties for f
 */
function figureProp (f) {
  if (figures[f] === undefined) 
    console.warn('figureProp('+f+') is undefined');  //  throw 'figureProp('+f+') is undefined';
  return figures[f];
}

/**
 * Get figure by id
 * @param {type} figId
 * @returns {nm$_figures.figures} figure properties for figId
 */
function figureById( figId ) {
  return figureProp(''+figId);
}

/**
 * Get image of a figure id
 * @param {type} figId
 * @returns {nm$_figures.figures.img}
 */
function figureImgUrl( figId ) {
  let fo = figureById( figId );
  if (!fo) fo = figureList[0];
  return fo.img;
}


module.exports = {
  TRIPLE_FIG:       TRIPLE_FIG,
  figures:          figures,
  figureList:       figureList,
  figureProp:       figureProp,
  figureById:       figureById,
  figureImgUrl:     figureImgUrl
};

},{}],6:[function(require,module,exports){
/* 
 * module triple-game
 * 
 */

const triple_game          = require('./triple_game.js');
const board                = require('./board.js');
const figures              = require('./figures.js');

module.exports = {
  TripleGame:              triple_game.TripleGame,
  Game:                    triple_game.TripleGame,
  Pos:                     board.Pos,
  Board:                   board.Board,
  TRIPLE_FIG:              figures.TRIPLE_FIG,
  figures:                 figures.figures,
  figureProp:              figures.figureProp,
  figureList:              figures.figureList,
  figureById:              figures.figureById,
  figureImgUrl:            figures.figureImgUrl  
};

},{"./board.js":1,"./figures.js":5,"./triple_game.js":7}],7:[function(require,module,exports){
/* 
 * triple_game.js
 * 
 * Triple Game Logic
 *   
 * (c) 2018 by Willi Commer (wcs)
 * 
 * version 2.1.3
 * 
 * 
 * history
 * ---------------------------------------------------
 * 2.1.3
 * - webpack import
 * - setFigure(fig)
 * 2.1.2
 * 2018-10-xx
 * add nina and bear
 * add event handler (see ./doc/game-events.md)
 * 
 * 2017-08-21
 * copy from https://github.com/WilliCommer/TripleThree/blob/master/js/triple_game.js
 * 
 * 2016
 * 
 * Vorbereitung der Anpassungen von der Java Version in
 * C:\Users\wcs\Documents\Java\JavaWeb\TiplePrime\src\main\java\com\wcs\tipleprime\TripleGame.java
 * 
 * neu: function assign(src)
 * ---------------------------------------------------
 * 
 */


// modue import

const {TRIPLE_FIG, figureProp}    = require('./figures.js');
const {Pos, Board}                = require('./board.js');
const {percentageRandom}          = require('./utils');
const {defaultConfig}             = require('./config.js');




/**
 * Triple Game Engine
 * 
 * @param {type} aConfig
 * @returns this
 */

function TripleGame(aConfig = defaultConfig) {

  // private variables
  var board       = null;
  
  var empty_state = function() { return {
    next:         0,
    reserve:      0,
    score:        0,
    gold:         0,
    undo_enable:  0,
    game_over:    false,
    move_count:   0
  };};
  var state = empty_state();
  var bak         = null;
  var events      = {};
  var config      = null;
  var undo_fig    = -1;

  
  _newGame( aConfig );
  

  // return public interface
  return {
    
    /**
     * @returns {Board} the game board
     */
    get board()   { return board; },
    
    /** @returns {integer} the  next figure to play
     */
    nextFigure:   function () { return state.next; },

    /** @returns {integer} the total score
     */
    score:        function () { return state.score; },

    /** @returns {integer} the reserve figure
     */
    reserve:      function () { return state.reserve; },

    /** newGame() start new game */
    newGame:      _newGame,

    
    /**
     * Let the player (user) place next figure to field (x,y)
     * 
     * @param {integer} x
     * @param {integer} y
     * @param {integer} fig a optional figure to play
    */
    userMove:     _userMove,
    
    /**
     * Let the player (user) place next figure to field (pos)
     * 
     * @param {Pos} pos
    */
    turn:         function (pos) { return _userMove( pos.x,pos.y ); },

    /** undoMove() undo last user move */
    undoMove:     restoreGame,

    /** swapReserve() swap reserve and next figure */
    swapReserve:  _swapReserve,
    
    /**
     * Check if figure can be set on pos
     * @param {Pos} pos board coordinates
     * @param {integer} fig figure to set on this field
     * @returns boolean
     */
    isLegalMove:  isLegalMove, // (pos, figure)
    
    /** 
     * @returns boolean true if no more moves possible
     */
    gameOver:     function () { return board.getPosList(0).length === 0; },

    /**
     * add nextFigure from shop
     * @param {integer} fig 
    */
    addFigure:    addFigure,
            
    setConfig:    setConfig,
    getConfig:    getConfig,
    getState:     getState,
    setState:     setState,

    // DEBUG
    
    // set event callback
    // on('gameover', callback) || on('all',collback)
    on:           _on,                        
                                              
    // toString() return game as string                                          
    toString:     _toString,                  
    
    // show gameevents on console
    enableLogger: _enableLogger
     
 
  };




  
  // private functions

 
  
  
  // userMove(x,y) set next figure to x,y
  function _userMove(x,y, f) {
    let fig = state.next;
    let score = 0;
    let pos = new Pos(x,y);
    if (f !== undefined) fig = f;
    let figB = board.get(x,y);

    emit('move_begin', {fig: fig, pos: pos});

    // move to a treasure field will get the gold only
    if ((figB === TRIPLE_FIG.TREASURE) || (figB === TRIPLE_FIG.BIGTREASURE)) {
      setBoardPos(pos,  TRIPLE_FIG.EMPTY, figureProp(figB).score);
      state.gold += figureProp(figB).gold;
      emit('move_end', {gold: figureProp(figB).gold});
      return figureProp(figB).score;
    }

    if(isLegalMove(pos,fig)) {
      saveGame();
      switch (fig) {
        
        case TRIPLE_FIG.CRYSTAL: 
          fig = getCrystalFigure(pos);
          score = setFigure(x, y, fig);
          break;
          
        case TRIPLE_FIG.ROBOT:
          let newfig = figureProp(figB).destroyto;
          if (newfig === undefined) {
            score  = 0 - figureProp(figB).score;
            newfig = TRIPLE_FIG.EMPTY;
          } else {
            score  = figureProp(newfig).score;
          }
          setBoardPos(pos, newfig, score);
          break;
          
        case TRIPLE_FIG.BEAR:
          score = figureProp(fig).score;
          setBoardPos(pos, TRIPLE_FIG.BEAR, score);
          break;
          
        default:  
          score = setFigure(x, y, fig);
      }  // switch (fig)
      
      score += animateFigures(pos);
      state.score += score;

      state.next = newNextFigure();
      emit('nextfigure', {fig: state.next});
      
    }  else {   // isLegalMove
      emit('move_fail',{fig: fig, pos:pos});
    }
    
    emit('move_end', {fig: fig, pos:pos, score: score});
    ++state.move_count;
    
    return score;
  }
  
  
  function animateFigures(insertPos) {
    var bears = [];
    var score = 0;
    
    emit('animate_begin');
    // move bears 
    bears = board.getPosList(TRIPLE_FIG.BEAR);
    for (var i=0; i < bears.length; i++) {
      var figPos = bears[i];
      var newPos = getNewBearPos(figPos);
      if (newPos) {
        board.move(figPos, newPos);
        emit_movefigure(TRIPLE_FIG.BEAR, figPos, newPos);
      }
    };
    
    // create hash table with bears
    bears = board.getHash( (obj) => {
      var ok = (obj.val === TRIPLE_FIG.BEAR);
      if (ok) {
        obj.fixed = getNewBearPos(obj.pos) === null;
        obj.checked = false;
      };
      return ok;
    });

    // convert fixed bear clusters to tomb
    for (var key in bears) {
      var bear = bears[key];
      if (bear.checked) continue;
      var group = board.getCluster( bear.pos, [TRIPLE_FIG.BEAR, TRIPLE_FIG.NINJA]);
      var n = 0;
      for (let i=0; i < group.length; i++) {
        var b = bears[group[i].key];
        if (b) { // else it's a ninja
          b.checked = true;
          if (b.fixed) n++;
        }  
      }
      if (n !== group.length) continue;  // continue if at least one bear is moveable
      // kill fixed group
      for (let i=0; i < group.length; i++) {
        setBoardPos(group[i], TRIPLE_FIG.TOMB);
      }
      score += figureProp(TRIPLE_FIG.TOMB).score * group.length;
    }

    // find tomb cluster and grow them to church
    var hash = board.getHash( (obj) => { return (obj.val === TRIPLE_FIG.TOMB); } );
    for (let key in hash) {
      let obj = hash[key];
      if (obj.checked) continue;
      let group = getPartners( obj.pos.x, obj.pos.y, TRIPLE_FIG.TOMB);
      if (group.length > 0) {
        for (let i=0; i < group.length; i++) hash[group[i].key].checked = true;
        let i = indexOfPos(group, insertPos);
        if (i < 0) i = 0;
        score += setFigure(group[i].x, group[i].y, TRIPLE_FIG.TOMB);
      }
    }


    // move ninjas
    bears = board.getPosList(TRIPLE_FIG.NINJA);
    for (let i=0; i < bears.length; i++) {
      let spare = board.getPosList(TRIPLE_FIG.EMPTY);
      let n = Math.floor(Math.random() * spare.length);
      board.move(bears[i], spare[n]);
      emit_movefigure(TRIPLE_FIG.NINJA,bears[i], spare[n]);
    };

    emit('animate_end');
    
    // check 'game over'
    state.game_over = board.getPosList(TRIPLE_FIG.EMPTY).length === 0;
    if (state.game_over)  emit('gameover');

    return score;
  }

  


  function getNewBearPos (actualPos) {
    var n = board.neighbours(actualPos);
    if (n.length === 0) return null;
    var i = Math.floor(Math.random() * n.length);
    if (isLegalMove(n[i],TRIPLE_FIG.BEAR)) return n[i];
    for (i=0; i < n.length; i++) {
      if (isLegalMove(n[i],TRIPLE_FIG.BEAR)) return n[i];
    }
    return null;
  }



  function setConfig (newConfig) {
    if (!config) config = defaultConfig;
    if (newConfig)
      config = Object.assign(config, newConfig);
    _enableLogger(config.logger);
    board = new Board( config.board_size.x, config.board_size.y );
    if (newConfig.board) 
      board.setString(newConfig.board);
    if (newConfig.state) 
      setState(newConfig.state);
    emit('setconfig', {config: config.name});
  }

  function getConfig () {
    emit('getconfig');
//    config.board = board.toString();
    return config;
  }

  function getState () {
    emit('getstate');
    var s = Object.assign({},state);
    s.board = board.toString();
    return s;
  }
  
  function setState (newState) {
    emit('setstate');
    for (let key in state) if (newState[key] !== undefined) state[key] = newState[key];
    if (newState.board) 
      board.setString(newState.board);
  }
  
  
  // save game to bak
  function saveGame() {
    emit('saveundo');
    bak = getState();
    state.undo_enable = true;
  }

  // restore game from bak
  function restoreGame() {
    if(!bak) return;
    emit('undo');
    undo_fig = state.next;
    setState(bak);
    bak = null;
    state.undo_enable = false;
  }

  // swapReserve() swap reserve and next figure
  function _swapReserve() {
    var f = state.reserve;
    state.reserve = state.next;
    state.next = f;
    if(state.next === TRIPLE_FIG.EMPTY) 
      state.next = newNextFigure();
    emit('swapreserve');
  }

  
// newGame() start new game
  function _newGame( aConfig = config ) {
    emit('newgame');
    setConfig( aConfig );
    emit('nextfigure', {fig: state.next});
    
    // set initial random figures 
    var count = config.initial_count;
    for(let i=0; i < count; ++i) {
      let x = Math.floor(Math.random() * board.cols);
      let y = Math.floor(Math.random() * board.rows);
      let f = newFigure(config.initial_figures);
      setFigure(x,y,f);
    };
    if (!state.next)
      state.next = newNextFigure();
    
  }
  
    
  
  // return true if fig can set at x,y
  function isLegalMove(pos, fig) {
    if(!fig) fig = state.next;
    if(!board.validPos(pos)) return false;
    var boardFig = board.getPos(pos);
    
    if ((boardFig === TRIPLE_FIG.TREASURE) || (boardFig === TRIPLE_FIG.BIGTREASURE)) 
      return true;

    if(boardFig === TRIPLE_FIG.EMPTY) 
      return fig !== TRIPLE_FIG.ROBOT;
    
    return fig === TRIPLE_FIG.ROBOT;
  }
  
  function addFigure ( fig ) {
    undo_fig = state.next;
    state.next = fig;
  }

  // set figure at x,y and return score
  function setFigure(x,y,f) {
    var score = figureProp(f).score;
    var pos   = new Pos(x,y);
    setBoardPos(pos, f, score);
    var growto = figureProp(f).growto;
    while (growto) {
      var l = getPartners(x, y, f);
      if (l.length >= 3) {
        l.forEach(function(v) {
          setBoardPos(v, TRIPLE_FIG.EMPTY);
        });
        var growscore = figureProp(growto).score;
        if (l.length > 3) growscore += growscore;
        score += growscore;
        setBoardPos(pos, growto, score);
        f = growto;
        growto = figureProp(f).growto;
      } else
        growto = null;
    } 
    return score;
  }



  function getPartners( x, y, f ) {
    return board.getCluster( new Pos(x,y), f);
  }

  // return figure as result of a crystal
  function getCrystalFigure(pos) {
    var result = TRIPLE_FIG.ROCK;
    var max = 1;
    var neighbours = board.neighbours(pos);
    neighbours.forEach(function(p) {
      var fig = board.getPos(p);
      if((fig !== TRIPLE_FIG.EMPTY) && (fig !== TRIPLE_FIG.BEAR)) {
        var cnt = board.getCluster( pos, fig ).length;
        if (cnt >= 3) {
          cnt = cnt * figureProp(fig).score;
          if(cnt > max) {
            max = cnt;
            result = fig;
          }
        }
      }
    });
    return result;
  }

  function setBoardPos(pos, fig, score) {
    board.setPos(pos, fig);
    emit_setfigure(fig, pos, (score || 0));
  }

  // return index of {x,y} object pos in array a
  function indexOfPos( a, pos ) {
    if((!a) || (a.length === 0)) return -1;
    for(var i = 0; i < a.length; ++i) {
      if( (a[i].x === pos.x) && (a[i].y === pos.y) )
        return i;
    }
    return -1;	
  }



  // generate next figure
  function newFigure (list) {
    if (!list || list.length === 0) return 0;
    var prob = list.map( x => x[1] );
    var i = percentageRandom(prob,true);
    return list[i][0];
  }
  
  function newNextFigure () {
    var result;
    if (undo_fig >= 0) {
      result = undo_fig;
      undo_fig = -1;
    } else
      result = newFigure(config.next_figures);
    return result;
  }
  

  // return game as string
  function _toString() {
    var result = '';
    result += board.toStringFramed();
    result += 'next: ' + state.next + ' reserve: ' + state.reserve + ' score: ' + state.score + ' gold: ' + state.gold + '\n';
    return result;
  }


  // ------------------------
  // event interface
  
  function _on( event, callback) {
    events[event] = callback;
  }
  
  function emit( event, data ) {
    if (!events[event] && !events.all) return;
    if (!data) data = {};
    data.event = event;
    if (events[event]) events[event]( data );
    if (events.all) events.all( data );
  }
  
  function emit_setfigure (fig, pos, score ) {
    emit('setfigure', {fig: fig, pos: pos, score: (score || 0)});
  }

  function emit_movefigure (fig, fromPos, toPos) {
    emit('movefigure', {fig: fig, pos: fromPos, newpos: toPos});
  }

  function _enableLogger (val=true) {
    if (!val) {
      events = {};
      return;
    }
    
    if (Array.isArray(val)) {
      val.forEach( e => _on(e, game_logger)); 
      return;
    }
    
    _on('all', game_logger); 
  }
  
};        


// ------------------------------------------------

function gameEventToString (data) {

  function figStr (fig) {
    var p = figureProp(fig);
    if (p) return p.name + ' (' + fig + ')';
    return fig;
  }

  function posStr (pos) { 
    return '['+pos.x+','+pos.y+']'; 
  }

  function kvStr (k,v) {
    return '' + k + ': ' + v;
  }

  var a = [];
  for (var key in data) {
    switch (key) {
      case 'event': 
        break;
      case 'fig':
        a.push(kvStr(key, figStr(data.fig))); 
        break;
      case 'pos':   
      case 'newpos':
        a.push(kvStr(key, posStr(data[key]))); 
        break;
      default:
        a.push(kvStr(key, data[key]));
    }  
  }
  
  return data.event + '  ' + a.join(', ');
  
}

function game_logger (data, callback) {
  console.log('game-logger: ', gameEventToString(data));
//  console.log('game-logger: ', data.message);
};







// node.js export

if(module) {
  module.exports = {
    TripleGame: TripleGame
  };
};



/*
if(module) {
  var exports = module.exports = {};

  exports.game = function(size) {
    return new TripleGame(size);
  };

  exports.board = function(size) {
    return new Board(size, size);
  };
  
  exports.TRIPLE_FIG = TRIPLE_FIG;
  
  exports.Pos = Pos;
  exports.Board = Board;
};
*/

},{"./board.js":1,"./config.js":2,"./figures.js":5,"./utils":9}],8:[function(require,module,exports){
/* 
 */

module.exports = {
  getProp:   getProp,
  checkProp: checkProp
};


function getProp (dst, src, name, deflt) {
  if (!src || !dst || !name) return false;
  if (src[name] === undefined) {
    if (deflt !== undefined) dst[name] = deflt;
    return false;
  }
  dst[name] = src[name];
  return true;
}

function checkProp (dst,name,deflt) {
  if (!dst || !name || !deflt || (dst[name] !== undefined)) return false;
  dst[name] = deflt;
  return true;
}



},{}],9:[function(require,module,exports){
module.exports.percentageRandom       = require('./percentage-random.js');
module.exports.getProp                = require('./get-prop.js').getProp;
module.exports.checkProp              = require('./get-prop.js').checkProp;


},{"./get-prop.js":8,"./percentage-random.js":10}],10:[function(require,module,exports){
module.exports = percentageRandom;

// percentageRandom (list [, roundup=false])
// list is a array of percent values like [10, 2.5, 2.5, 15, 40, 30]
// is the sum of all array items is not 100%, call it with roundup=true
// return value is a random array index, weight by percentage items 

function percentageRandom (list, roundup=false) {
  var r = Math.random() * 100;  // random between 0 and 100
  var factor = 1;

  // calculate factor to 100%
  if (roundup) {
    factor = 0;
    for (let i=0; i < list.length; i++) 
      factor += list[i];
    factor = 100 / factor;
  }
  // find random index
  for (let i=0; i < list.length; i++) 
    if ((r -=  (list[i] * factor)) < 0)  
      return i;
  // rounding diff will result first item
  return 0;  
}


function test_percentageRandom () {


  function run_test(list, roundup) {
    var runs = 1e6;
    var stat = new Array(list.length).fill(0);
    for (let i = 0; i < runs; i++) {
      ++stat[percentageRandom(list,roundup)];
    }
    stat = stat.map(x => Math.floor(x / runs * 100));
    console.log(list, ' > ', stat);
  }
  
  run_test([15, 15, 20, 50]);
  run_test([10, 10, 20, 50]);
  run_test([10, 10, 20, 50], true);
  run_test([10, 10, 20, 20], true);

}

},{}]},{},[6])(6)
});
