/*
 * 
 */


const {TRIPLE_FIG} = require('../figures.js');

module.exports = () => new Object({
  
  name: 'Special 1',
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

