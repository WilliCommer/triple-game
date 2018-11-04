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



