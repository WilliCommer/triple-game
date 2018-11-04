/* 
 * Copyright (C) 2018 wcs <wcs at willicommer.de>
 * 
 */


module.exports = function () {
  
// const {InputLoop, StatusContext_Input, StatusContext_Menu, SelectItems} = require('inputloop');
const InputLoop                 = require('inputloop').InputLoop;
const StatusContext_Menu        = require('inputloop').StatusContext_Menu;
const Game                      = require('../index.js').Game;

var game = new Game();
var logon = false;



var playMenu  = new StatusContext_Menu;
playMenu.config({
  message: "you turn ?",
  isMenu: true,
  isKeyPress: false,
  items: [
    {key: 'U', text: 'Undo', value: 'undo'},
    {key: 'S', text: 'Swap Reserve', value: 'swap'},
    {key: 'L', text: 'Switch Logger', value: 'switchlogger'},
    {key: 'E', text: 'Exit', value: 'exit'}
  ],
  onStatusEnter: showBoard,
  onDone: (loop) => { playMenu.isShortPrompt = true; loop.setStatus(loop.line); },
  onFail: (loop) => { playMenu.isShortPrompt = false;  doPlay(loop); }
});



var app = new InputLoop({
  'userplay': playMenu.context,
  'undo': {
    onStatusEnter: (app) => { game.undoMove(); app.setStatus('userplay'); }
  },
  'swap': {
    onStatusEnter: (app) => { game.swapReserve(); app.setStatus('userplay'); }
  },
  'switchlogger': {
    onStatusEnter: app => { logon = !logon; game.enableLogger(logon); app.setStatus('userplay'); }
  },
  'exit': {
    onStatusEnter: () => { process.exit(0); }
  }
});

app.start();

function showBoard() {
  console.log(game.toString());
};
function gameUndo() {
};
function gameSwap() {
};

function doPlay (loop) {
  let input = loop.line.trim();
  if (input === '') return fail();
  let r;
  if (input.indexOf(' ') === -1)
    r = input.split('');
  else
    r = input.split(' ');
  let x = parseInt(r[0]);
  let y = parseInt(r[1]);
  if (x === NaN || y === NaN) return fail;
  
  console.log('x: ' + x + ' y: ' + y);
  result = game.userMove(x,y);
  if (!result) return fail();
  
  loop.setStatus('userplay');
  playMenu.isShortPrompt = true;
  
  function fail () {
    console.log('Enter x y to play');
    loop.setStatus('userplay');
    playMenu.isShortPrompt = false;
  }
  }
  
  
  
  
  }  // export
  