/* 
 * Triple Game configuration
 */

var configList = [
  require('./config/default.js'),
  require('./config/test.js')
];


module.exports = {
  configList:         configList,
  defaultConfig:      configList[0]
};

