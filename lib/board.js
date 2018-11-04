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
   * @param {...args} args  see {@link #assign} for optional parameter
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


