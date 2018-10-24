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
