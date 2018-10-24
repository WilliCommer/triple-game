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
