"use strict";

/* 
 * test module triple-game
 * 
 */


const assert        = require('assert');
const {
  Game,
  Pos,Board,
  TRIPLE_FIG}       = require('../index.js');



function emptyGame() {
  var game = new Game();
  game.board.fill(0);
  return game;
}


describe('check board basics', function() {
  var game = emptyGame();
  
  it('check empty game', function () {
    assert.ok( game );
    assert.ok( game.board.rows === 6);
  });  
  
  it('check class Pos', function() {
    let p12 = new Pos(1,2);
    let p;
    assert.strictEqual(p12.x, 1);
    assert.strictEqual(p12.y, 2);
    p = new Pos(p12);
    assert.equal(p12.key, p.key);
    p = new Pos('1-2');
    assert.equal(p12.key, p.key);
    p.key = '5-5';
    assert.equal(p.key, new Pos(5,5).key);
    p.key = '1-2';
    assert.ok( p.eq(p12) );
    
    
  });

  it('check setString', function () {
    var s1 = '230 0 0 0 0 ' + '\n' 
           + '0 2 0 0 0 0 ' + '\n' 
           + '0 0 3 0 0 0 ' + '\n' 
           + '0 0 0 4 0 0 ' + '\n' 
           + '0 0 0 0 110 ' + '\n' 
           + '0 0 0 0 0 8 ' + '\n' ;
    game.board.setString(s1);
    var s2 = game.board.toString();
    assert.strictEqual(s1,s2);
    
    var f = game.board.get(0,0);
    assert.strictEqual(f,23);

    var f = game.board.get(4,4);
    assert.strictEqual(f,11);
    
    var f = game.board.get(5,5);
    assert.strictEqual(f,8);
  });  

 
  it('check hash table', function () {
    var s1 = '230 0 0 0 0 ' + '\n' 
           + '0 2 0 0 0 0 ' + '\n' 
           + '0 0 3 0 0 0 ' + '\n' 
           + '0 0 0 4 0 0 ' + '\n' 
           + '0 0 0 0 110 ' + '\n' 
           + '0 0 0 0 0 8 ' + '\n' ;
    game.board.setString(s1);

    var hash = game.board.getHash();
    assert.ok(hash['0-0']);
    assert.strictEqual(hash['0-0'].val, 23);
    assert.strictEqual(hash['5-5'].val, 8);

    hash = game.board.getHash( (obj) => {
      if (obj.val === 2) {
        obj.checked = 5;
        return true;
      }
      return false;
    });
    assert.ok(hash['0-0'] === undefined);
    assert.ok(hash['1-1']);
    assert.ok(hash['1-1'].checked  === 5);
    
  });  
  
  it('check getCluster', function () {
    var l;
    var s1 = '1 1 1 2 2 2 ' + '\n' 
           + '0 0 0 0 0 0 ' + '\n' 
           + '1 2 1 0 0 0 ' + '\n' 
           + '1 2 1 4 0 0 ' + '\n' 
           + '1 1 1 0 1 0 ' + '\n' 
           + '0 0 0 0 0 8 ' + '\n' ;
    game.board.setString(s1);

    l = game.board.getCluster(new Pos(0,0));
    assert.strictEqual(l.length, 3);
    l = game.board.getCluster(new Pos(0,0), 1);
    assert.strictEqual(l.length, 3);
    l = game.board.getCluster(new Pos(0,0), 2);
    assert.strictEqual(l.length, 1);
    l = game.board.getCluster(new Pos(0,0), 2, true);
    assert.strictEqual(l.length, 0);
    l = game.board.getCluster(new Pos(0,0), [1,2]);
    assert.strictEqual(l.length, 6);
    l = game.board.getCluster(new Pos(0,2), [1,2]);
    assert.strictEqual(l.length, 9);
    l = game.board.getCluster(new Pos(0,2), [1]);
    assert.strictEqual(l.length, 7);
  });  
  
});

/*
describe('config test', function() {

  it('stringify', function () {
    
    // create game 
    var game = new Game();
    game.board.set(0,0,5);
    var st1 = game.getConfig();
    st1.next_figure = 6;

    assert.strictEqual(game.board.get(0,0), 5);
    assert.ok(st1.board);
    assert.strictEqual(st1.board[0][0], '5');
    
    // make string
    var status_str = JSON.stringify(st1);
    
    // create new game and set status
    var game = new Game();
    game.board.set(0,0,0);
    assert.strictEqual(game.board.get(0,0), 0);
    game.setConfig(st1);
    assert.strictEqual(game.board.get(0,0), 5);
    assert.strictEqual(game.nextFigure(), 6);
    
    
    // test browse problem with undo
    // 1. simples undo
    game.board.fill(0);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.GRASS) > 0);
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.GRASS);
    game.undoMove();
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.EMPTY);

    // 2.  undo nach getConfig
    game.board.fill(0);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.GRASS) > 0);
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.GRASS);
    game.getConfig();
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.GRASS);
    game.undoMove();
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.EMPTY);
    
  });  
*/


describe('state test', function() {
  
  it('stringify', function () {
    
    // create game 
    var game = new Game();
    game.board.set(0,0,5);
    var st1 = game.getState();
    st1.next = 6;

    assert.strictEqual(game.board.get(0,0), 5);
    assert.ok(st1.board);
    assert.strictEqual(st1.board[0][0], '5');
    
    // make string
    var status_str = JSON.stringify(st1);
    
    // create new game and set status
    var game = new Game();
    game.board.set(0,0,0);
    assert.strictEqual(game.board.get(0,0), 0);
    game.setState(st1);
    assert.strictEqual(game.board.get(0,0), 5);
    assert.strictEqual(game.nextFigure(), 6);
    
    
    // test browse problem with undo (sollte behoben sein)
    // 1. simples undo
    game.board.fill(0);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.GRASS) > 0);
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.GRASS);
    game.undoMove();
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.EMPTY);

    // 2.  undo nach getState
    game.board.fill(0);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.GRASS) > 0);
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.GRASS);
    game.getState();
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.GRASS);
    game.undoMove();
    assert.strictEqual(game.board.get(0,0), TRIPLE_FIG.EMPTY);
    
  });  

  it('undo next figure', function () {
    
    // create game 
    var game = new Game();
    game.board.fill(0);
    var st = game.getState();
    st.next = 6;

    game.setState(st);
    assert.strictEqual(game.nextFigure(), 6);

    assert.ok( game.userMove(0,0) > 0 );
    
    assert.strictEqual(game.board.get(0,0), 6);
    var nf = game.nextFigure();
    assert.notStrictEqual(nf,6);

    game.undoMove();

    assert.strictEqual(game.board.get(0,0), 0);
    assert.strictEqual(game.nextFigure(), 6);

    assert.ok( game.userMove(1,1) > 0 );
    assert.strictEqual(game.nextFigure(), nf);

    
  });  

});





describe('check userMove', function() {
  var game = emptyGame();
  var s1,s2,s3;
  
  it('grow test 1', function () {
    s1 = '1 1 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    s2 = '0 0 2 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    game.board.setString(s1);
    game.userMove(2,0,1);
    s3 = game.board.toString();
    assert.strictEqual(s3,s2);
  });  

  it('grow test 2', function () {
    s2 = '0 3 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    game.userMove(0,0,2);
    game.userMove(1,0,2);
    s3 = game.board.toString();
    assert.strictEqual(s3,s2);
  });  


  it('grow test crystal rock', function () {
    s1 = '1 1 0 0 0 0 ' + '\n' 
       + '2 0 0 0 0 0 ' + '\n' 
       + '2 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    s2 = '1 1 0 0 0 0 ' + '\n' 
       + '2 0 200 0 0 ' + '\n' 
       + '2 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    game.board.setString(s1);
    game.userMove(2,1, TRIPLE_FIG.CRYSTAL);
    s3 = game.board.toString();
    assert.strictEqual(s3,s2);
  });  

  it('grow test crystal', function () {
    s1 = '1 1 0 0 0 0 ' + '\n' 
       + '2 0 0 0 0 0 ' + '\n' 
       + '2 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    s2 = '1 1 0 0 0 0 ' + '\n' 
       + '0 3 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    game.board.setString(s1);
    game.userMove(1,1,TRIPLE_FIG.CRYSTAL);
    s3 = game.board.toString();
    assert.strictEqual(s3,s2);
  });  

  it('crystal multi rock', function () {
    game.board.fill(0);
    // two crystal in upper row
    assert.ok( game.userMove(0,0,TRIPLE_FIG.CRYSTAL) > 0);
    assert.ok( game.userMove(1,0,TRIPLE_FIG.CRYSTAL) > 0);
    assert.strictEqual( game.board.get(0,0) ,TRIPLE_FIG.ROCK );
    assert.strictEqual( game.board.get(1,0) ,TRIPLE_FIG.ROCK );
    // third crystal should make big rock
    assert.ok( game.userMove(2,0,TRIPLE_FIG.CRYSTAL) > 0);
    assert.strictEqual( game.board.get(0,0) ,TRIPLE_FIG.NONE );
    assert.strictEqual( game.board.get(1,0) ,TRIPLE_FIG.NONE );
    assert.strictEqual( game.board.get(2,0) ,TRIPLE_FIG.MOUNTAIN );
  });  

  it('specific crystal test', function () {
    s1 = '1 1 0 0 0 0 ' + '\n' 
       + '20206 2 2 0 ' + '\n' 
       + '2 0 0 1 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    game.board.setString(s1);
    assert.ok( game.userMove(2,2,TRIPLE_FIG.CRYSTAL) > 0);
    assert.strictEqual( game.board.get(2,2) ,TRIPLE_FIG.ROCK );
  });  

  it('rocks by crystal grow to big treasure', function () {
    game.board.fill(0);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.CRYSTAL) > 0);
    assert.ok( game.userMove(1,0,TRIPLE_FIG.CRYSTAL) > 0);
    assert.ok( game.userMove(2,0,TRIPLE_FIG.CRYSTAL) > 0);
    assert.strictEqual( game.board.get(2,0) ,TRIPLE_FIG.MOUNTAIN);
    assert.ok( game.userMove(0,1,TRIPLE_FIG.CRYSTAL) > 0);
    assert.ok( game.userMove(1,1,TRIPLE_FIG.CRYSTAL) > 0);
    assert.ok( game.userMove(2,1,TRIPLE_FIG.CRYSTAL) > 0);
    assert.strictEqual( game.board.get(2,1) ,TRIPLE_FIG.MOUNTAIN);
    assert.ok( game.userMove(0,2,TRIPLE_FIG.CRYSTAL) > 0);
    assert.ok( game.userMove(1,2,TRIPLE_FIG.CRYSTAL) > 0);
    assert.ok( game.userMove(2,2,TRIPLE_FIG.CRYSTAL) > 0);
    assert.strictEqual( game.board.get(2,2) ,TRIPLE_FIG.BIGTREASURE);
  });  


  it('robot test', function () {
    s1 = '1 1 0 0 0 0 ' + '\n' 
       + '2 0 0 0 0 0 ' + '\n' 
       + '2 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    game.board.setString(s1);
    assert.ok( game.isLegalMove(new Pos(0,0), TRIPLE_FIG.ROBOT)); // , 'geht');
    assert.ok( !game.isLegalMove(new Pos(1,1), TRIPLE_FIG.ROBOT)); //, 'geht nicht');
    assert.ok( game.userMove(0,0,TRIPLE_FIG.ROBOT) < 0);
    assert.strictEqual( game.board.get(0,0) ,TRIPLE_FIG.NONE );
    assert.ok( game.userMove(1,1,TRIPLE_FIG.ROBOT) === 0);
    assert.strictEqual( game.board.get(1,1) ,TRIPLE_FIG.NONE );
    
    // robot on bear
    game.board.set(0,0,TRIPLE_FIG.BEAR);
    assert.ok( game.isLegalMove(new Pos(0,0), TRIPLE_FIG.ROBOT));
    assert.ok( game.userMove(0,0,TRIPLE_FIG.ROBOT) > 0);
    assert.strictEqual( game.board.get(0,0), TRIPLE_FIG.TOMB );

    // robot on rock
    game.board.set(0,0,TRIPLE_FIG.ROCK);
    assert.ok( game.isLegalMove(new Pos(0,0), TRIPLE_FIG.ROBOT));
    assert.ok( game.userMove(0,0,TRIPLE_FIG.ROBOT) !== 0);
    assert.strictEqual( game.board.get(0,0), TRIPLE_FIG.NONE );
    
    // robot n mounain
    game.board.set(0,0,TRIPLE_FIG.MOUNTAIN);
    assert.ok( game.isLegalMove(new Pos(0,0), TRIPLE_FIG.ROBOT));
    assert.ok( game.userMove(0,0,TRIPLE_FIG.ROBOT) > 0);
    assert.strictEqual( game.board.get(0,0), TRIPLE_FIG.TREASURE );
    
  });  

  it('check undo', function () {
    s1 = '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' 
       + '0 0 0 0 0 0 ' + '\n' ;
    game.board.setString(s1);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.GRASS) > 0);
    assert.notStrictEqual(s1, game.board.toString());
    game.undoMove();
    assert.strictEqual(s1, game.board.toString());
    
  });  

  it('check game over', function () {
    // generaly game over test
    game.board.fill(1);
    game.board.set(0,0,0);
    assert.ok( game.gameOver() === false);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.BUSH) > 0);
    assert.ok( game.gameOver() === true);
    assert.ok(game.board.get(0,0) === TRIPLE_FIG.BUSH );
  });  

  it('check game over callback', function () {
    
    var called = 0;
    function onGameOver() {
      ++called;
    };

    // callback test
    game.board.set(0,0,0);
    assert.ok( game.gameOver() === false);
    game.on('gameover', onGameOver);
    assert.strictEqual( called, 0 );
    assert.ok( game.userMove(0,0,TRIPLE_FIG.BUSH) > 0);
    assert.ok( game.gameOver() === true);
    assert.strictEqual( called, 1 );
    // remove event
    game.on('gameover');
    // try again
    game.board.set(0,0,0);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.BUSH) > 0);
    assert.ok( game.gameOver() === true);
    assert.strictEqual( called, 1 );

  });  


    
});


describe('Bear tests', function() {

  var game = emptyGame();
  
  let s1   =
    '1 0 1 0 0 0 ' + '\n' 
  + '2 3 1 0 0 0 ' + '\n' 
  + '2 0 2 0 0 0 ' + '\n' 
  + '1 0 1 0 0 0 ' + '\n' 
  + '1 0 1 0 0 0 ' + '\n' 
  + '0 2 0 0 0 0 ' + '\n' ;
  
  it('set and destroy fixed bear', function () {
    game.board.setString(s1);
    assert.ok( game.userMove(0,0,TRIPLE_FIG.BEAR) === 0);
    assert.ok( game.userMove(1,0,TRIPLE_FIG.BEAR) > 0);
    assert.strictEqual( game.board.get(0,0) ,TRIPLE_FIG.GRASS, 'should be grass' );
    assert.strictEqual( game.board.get(1,0) ,TRIPLE_FIG.TOMB, 'should be dead bear' );
// game.enableLogger();
    assert.ok( game.userMove(1,0,TRIPLE_FIG.ROBOT) !== 0); //, 'robot bear');
    assert.strictEqual( game.board.get(1,0) ,TRIPLE_FIG.EMPTY); //, 'should be empty' );
  });  

  it('set not so fixed bear', function () {
    game.board.setString(s1);
    assert.ok( game.userMove(1,2,TRIPLE_FIG.BEAR) > 0);
    assert.strictEqual( game.board.get(1,2) ,TRIPLE_FIG.EMPTY); //, 'should be empty, bear moved' );
  });  

  it('set fixed bear grow to church', function () {
    game.board.setString(s1);
    game.board.set(1,3,TRIPLE_FIG.TOMB);
    game.board.set(1,4,TRIPLE_FIG.TOMB);
    assert.ok( game.userMove(1,2,TRIPLE_FIG.BEAR) > 0);
    assert.strictEqual( game.board.get(1,2) ,TRIPLE_FIG.CHURCH); //, 'should be grown to church' );
    assert.strictEqual( game.board.get(1,3) ,TRIPLE_FIG.EMPTY); //, 'should be empty' );
  });  

    
  it('set fixed bear grow to cathedral', function () {
    let s2   =
    '40311 0 0 0 ' + '\n' 
  + '400 1 0 0 0 ' + '\n' 
  + '2 312 0 0 0 ' + '\n' 
  + '1 311 0 0 0 ' + '\n' 
  + '1 0 1 0 0 0 ' + '\n' 
  + '0 2 0 0 0 0 ' + '\n' ;
    game.board.setString(s2);
    assert.ok( game.userMove(1,1,TRIPLE_FIG.BEAR) > 0);
    assert.strictEqual( game.board.get(1,1) ,TRIPLE_FIG.CATHEDRAL); //, 'should be grown to cathedral' );
    assert.strictEqual( game.board.get(1,3) ,TRIPLE_FIG.EMPTY); //, 'should be empty' );
    assert.strictEqual( game.board.get(0,0) ,TRIPLE_FIG.EMPTY); //, 'should be empty' );
  });  

  it('set fixed bear grow to gold', function () {
    let s2   =
    '4031410 0 0 ' + '\n' 
  + '400 410 0 0 ' + '\n' 
  + '2 312 0 0 0 ' + '\n' 
  + '1 311 0 0 0 ' + '\n' 
  + '1 0 1 0 0 0 ' + '\n' 
  + '0 2 0 0 0 0 ' + '\n' ;
    game.board.setString(s2);
    assert.ok( game.userMove(1,1,TRIPLE_FIG.BEAR) > 0);
    assert.strictEqual( game.board.get(1,1) ,TRIPLE_FIG.TREASURE); //, 'should be grown to cathedral' );
    assert.strictEqual( game.board.get(1,3) ,TRIPLE_FIG.EMPTY); //, 'should be empty' );
    assert.strictEqual( game.board.get(0,0) ,TRIPLE_FIG.EMPTY); //, 'should be empty' );
  });  
  
  it('killed bear should be church', function () {
    let s2   =
    '0 3030301 0 ' + '\n' 
  + '2 1 1 2 1 0 ' + '\n' 
  + '0 0 0 0 0 0 ' + '\n' 
  + '0 0 0 0 0 0 ' + '\n' 
  + '0 0 0 0 0 0 ' + '\n' 
  + '0 0 0 0 0 0 ' + '\n' ;
    game.board.setString(s2);
    assert.ok( game.userMove(1,0, TRIPLE_FIG.ROBOT) > 0);
    assert.strictEqual( game.board.get(1,0) ,TRIPLE_FIG.CHURCH);
  });  
});




