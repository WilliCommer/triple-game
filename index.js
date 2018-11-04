/* 
 * module triple-game
 * 
 */

const triple_game          = require('./lib/triple_game.js');
const board                = require('./lib/board.js');
const figures              = require('./lib/figures.js');
const config               = require('./lib/config.js');

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
  figureImgUrl:            figures.figureImgUrl,
  configList:              config.configList,
  defaultConfig:           config.defaultConfig
};
