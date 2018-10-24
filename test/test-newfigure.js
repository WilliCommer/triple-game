
// const triple_game = require('./triple_game');
const {TRIPLE_FIG,figureProp,figures} = require('../index.js');
const percentageRandom                = require('../utils').percentageRandom;

module.exports = test_newFigure;

function newFigure (list) {
    var probabilities = list.map( 
      x => figureProp(x).probability || 0  
    );
    return list[ percentageRandom(probabilities,true) ];
  };
  

function test_newFigure () {
  
  console.log('wait ..');
  var stat = {};
  var max = 1e6;
  var figlist = [];

  // make a list of figures with probability
  for (var fig in figures) 
    if (figureProp(fig).probability) figlist.push(fig);

  // get random figures and count them in stat
  for (var i=0; i < max; i++) {
    var f = newFigure([TRIPLE_FIG.GRASS,TRIPLE_FIG.TREE, TRIPLE_FIG.BUSH, TRIPLE_FIG.HUT, TRIPLE_FIG.BEAR, TRIPLE_FIG.CRYSTAL, TRIPLE_FIG.ROBOT, TRIPLE_FIG.NINJA]);    
    var s = stat[f] || 0;
    s = s + 1;
    stat[f] = s;
  }

  figlist.push(0);
  var total_proz = 0, total_should = 0;
  for (var i=0; i < figlist.length; i++) {
    var fig = figlist[i];
    var should = figureProp(fig).probability || 0;
    var ist = stat[fig] || 0;
    var proz = Math.floor((ist / max) * 1000) / 10;
    var n = figureProp(fig).name;
    while (n.length < 12) n += ' ';
    console.log(n, 'is', proz.toFixed(1), 'should', should);
    total_proz += proz;
    total_should += should;
  }
  console.log('totals', 'is',total_proz.toFixed(1), 'should', total_should.toFixed(1));
}
