/**
 * @fileOverview Triple Game Engine
 * @author Willi Commer (wcs)
 * @version 2.1.3
 */

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
 * @param {Config} aConfig
 * @returns this
 *
 *
 * @example
 * const {Game, TRIPLE_FIG} = require('triple-game)';
 * var game = new Game();
 * game.userMove(0,0);
 * 
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
    
    /**@lends TripleGame
     * @returns {Board} the game board
     */
    get board()   { return board; },
    
    /** @lends TripleGame
     *  @returns {integer} the  next figure to play
     */
    nextFigure:   function () { return state.next; },

    /** @lends TripleGame
     * @returns {integer} the total score
     */
    score:        function () { return state.score; },

    /** @lends TripleGame 
     * @returns {integer} the reserve figure
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
            
    /** set game configuration. board size, figure probability etc.
     * @param {Config} newConfig
     */        
    setConfig:    setConfig,
    
    /** get game configuration 
     * @returns {Config}
     */        
    getConfig:    getConfig,
    
    /** set game for example from a backup
     * @param {GameState} newState
     */
    setState:     setState,

    /** get game state. actual bard as string, next_figure, score etc.
     * @returns {GameState}
     */
    getState:     getState,

    // DEBUG
    
    /**
     * Set event callback. For detaile @see <a href="game-events.html">"Game Events"</a>.
     * @param {string} eventName
     * @param {function} callback
     * @example
     * // log game over
     * game.on('gameover', (e) => {console.log('GAME OVER')} );
     * 
     * // use 'all' for all events
     * game.on('all', (e) => {console.log('event:', e.name )} );
     * 
     */
     
    on:           _on,                        
                                              
    /**
     * Return game as string
     * @returns {string}
     * @example
     * console.log( new require('triple-game').Game().toString() ); 
     * 
     *   0 1 2 3 
     * -----------
     * 0|   1   1     
     * 1| 4 1   1     
     * 2|     1       
     * 3|             
     * next: 2 reserve: 0 score: 0 gold: 0
     * 
     */ 
    toString:     _toString,                  
    
    // 
    /**
     * Logger show game events on console. Parameter is true | false | array of event names.
     * @see <a href="game-events.html">"Game Events"</a>.
     * @param {boolean | string[]} val
     */
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



/**
 * GameState
 * @class
 */
const GameState = {
    /** next figure
     * @type [integer}
     */
    next:         0,
    
    /** reserve figure
     * @type {integer}
     */
    reserve:      0,
    
    /** actual score
     * @type {integer}
     */
    score:        0,
    
    /** gold
     * @type {integer}
     */
    gold:         0,
    
    /** 
     * @type {boolean}
     */
    undo_enable:  0,
    
    /** 
     * @type {boolean}
     */
    game_over:    false,
    
    /** number of moves in this game
     * @type {integer}
     */
    move_count:   0
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
