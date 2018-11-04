/* 
 * Copyright (C) 2018 wcs <wcs at willicommer.de>
 *
 */

/**
 * triple figure definitions
 * 
 * 
 * each figure (object or item) has an integer id. Use the symbols in TRIPLE_FIG.
 * 
 * Figure properties are in 'var figures'. 
 * use function figureProp() to retrieve figure property. Example:
 *    score = figureProp(TRIPLE_FIG.GRASS).score;
 * @example
 *   Figure Id Definitions
 *    
 *   EMPTY:              0,
 *   GRASS:              1,
 *   BUSH:               2,
 *   TREE:               3,
 *   HUT:                4,
 *   HOUSE:              5,
 *   MANSION:            6,
 *   CASTLE:             7,
 *   FLOATINGCASTLE:     8,
 *   TRIPLECASTLE:       9,
 *   ROCK:               20,
 *   MOUNTAIN:           21,
 *   ROBOT:              25,
 *   CRYSTAL:            26,
 *   BEAR:               30,
 *   TOMB:               31,
 *   NINJA:              32,
 *   CHURCH:             40,
 *   CATHEDRAL:          41,
 *   TREASURE:           50,
 *   BIGTREASURE:        51,
 *
 */

const TRIPLE_FIG = {
  EMPTY:              0,
  GRASS:              1,
  BUSH:               2,
  TREE:               3,
  HUT:                4,
  HOUSE:              5,
  MANSION:            6,
  CASTLE:             7,
  FLOATINGCASTLE:     8,
  TRIPLECASTLE:       9,
  ROCK:               20,
  MOUNTAIN:           21,
  ROBOT:              25,
  CRYSTAL:            26,
  BEAR:               30,
  TOMB:               31,
  NINJA:              32,
  CHURCH:             40,
  CATHEDRAL:          41,
  TREASURE:           50,
  BIGTREASURE:        51,

  SUPER:              100,
  SUPERBUSH:          102,   // SUPER + BUSH
  SUPERTREE:          103,   // SUPER + TREE 
  SUPERHUT:           104,
  SUPERHOUSE:         105,
  SUPERMENSION:       106,
  SUPERCASTLE:        107,
  NONE:               0
};



/**
 * Figure properties
 * @class
 */

const Figure = {
  /** TRIPLE_FIG value  
   * @type {iteger}
   */
  id: -1,
  
  /** 
   * key id as string 
   * @type {string}
   */
  key: '',
  
  /**
   * figure name
   * @type {string}
   */
  name: 'default',
  
  /** score for placing 
   * @type {number} */
  score: 0,
  
  /** used for treasure (optional) 
   * @type {number} */
  gold: 0,
  
  /** id of figure to grow to (optional) 
   * @type {integer} */
  growto: 0,
  
  /** id of figure when it is killed (optional) 
   * @type {integer} */
  destroyto: 0,
  
  /** name of image file 
   * @type {string} */
  img: 'none',
  
  /* probability to appear in percent 
   * @type {number}  */
  probability: 15,
  
  /** price in shop 
   * @type {number}  */
  cost: 0
};



/**
 * list of objects with figure properties
 * @constant
 * @type {Figure[]} figureList
 */ 

var figureList = [ 

  { name: 'default',
    score: 0,
    growto: 0,
    destroyto: 0,
    gold: 0,
    key: '',
    id: -1,
    img: 'none' },
  
  { name: 'Empty',
    score: 0,
    growto: 0,
    id: 0,
    key: '0',
    img: 'empty' },
  
  { name: 'Grass',
    score: 5,
    growto: 2,
    probability: 60,
    cost: 100,
    id: 1,
    key: '1',
    img: 'grass' },
  
  { name: 'Bush',
    score: 20,
    growto: 3,
    probability: 15,
    cost: 150,
    id: 2,
    key: '2',
    img: 'bush' },
  
  { name: 'Tree',
    score: 100,
    growto: 4,
    probability: 2,
    cost: 400,
    id: 3,
    key: '3',
    img: 'tree' },
  
  { name: 'Hut',
    score: 500,
    growto: 5,
    probability: 0.6,
    cost: 400,
    id: 4,
    key: '4',
    img: 'hut' },
  
  { name: 'House',
    score: 1500,
    growto: 6,
    probability: 0.3,
    id: 5,
    key: '5',
    img: 'house' },
  
  { name: 'Menison',
    score: 5000,
    growto: 7,
    id: 6,
    key: '6',
    img: 'menison' },
  { name: 'Castle',
    
    score: 20000,
    growto: 8,
    id: 7,
    key: '7',
    img: 'castle' },
  
  { name: 'Floating Castle',
    score: 100000,
    growto: 9,
    id: 8,
    key: '8',
    img: 'floatingcastle' },
  
  { name: 'Triple Castle',
    score: 200000,
    id: 9,
    key: '9',
    img: 'triplecastle' },
  
  { name: 'Rock',
    score: 500,
    growto: 21,
    probability: 2.5,
    id: 20,
    key: '20',
    img: 'rock' },
  
  { name: 'Mountain',
    score: 1000,
    growto: 51,
    destroyto: 50,
    id: 21,
    key: '21',
    img: 'mountain' },
  
  { name: 'Robot',
    score: 10,
    probability: 2.5,
    cost: 1000,
    id: 25,
    key: '25',
    img: 'robot' },
  
  { name: 'Crystal',
    score: 10,
    probability: 2.5,
    cost: 1500,
    id: 26,
    key: '26',
    img: 'crystal' },
  
  { name: 'Bear',
    score: 50,
    destroyto: 31,
    probability: 2.5,
    id: 30,
    key: '30',
    img: 'bear' },
  
  { name: 'Tomb',
    score: 50,
    growto: 40,
    id: 31,
    key: '31',
    img: 'tomb' },
  
  { name: 'Ninja',
    score: 50,
    destroyto: 31,
    probability: 1.5,
    id: 32,
    key: '32',
    img: 'ninja' },
  
  { name: 'Church',
    score: 1000,
    growto: 41,
    id: 40,
    key: '40',
    img: 'church' },
  
  { name: 'Cathedral',
    score: 5000,
    growto: 50,
    id: 41,
    key: '41',
    img: 'cathedral' },
  
  { name: 'Treasure',
    score: 5,
    growto: 51,
    gold: 500,
    id: 50,
    key: '50',
    img: 'treasure' },
  
  { name: 'Treasure',
    score: 10,
    gold: 1500,
    id: 51,
    key: '51',
    img: 'treasure' } 
];



function generateFigureHash (list){
  let result = {};
  for (let i=0; i < list.length; i++){
    result[list[i].key] = list[i];
  }
  return result;
}

/** figures is a hash of figureList */
var figures = generateFigureHash(figureList);

/**
 * Get figure by id
 * @param {string} f figure id (key)
 * @returns {Figure} figure properties for f
 */
function figureProp (f) {
  if (figures[f] === undefined) 
    console.warn('figureProp('+f+') is undefined');  //  throw 'figureProp('+f+') is undefined';
  return figures[f];
}

/**
 * Get figure by id
 * @param {integer} figId
 * @returns {Figure} figure properties for figId
 */
function figureById( figId ) {
  return figureProp(''+figId);
}

/**
 * Get image of a figure id
 * @param {integer} figId
 * @returns {string} image name
 */
function figureImgUrl( figId ) {
  let fo = figureById( figId );
  if (!fo) fo = figureList[0];
  return fo.img;
}


module.exports = {
  TRIPLE_FIG:       TRIPLE_FIG,
  figures:          figures,
  figureList:       figureList,
  figureProp:       figureProp,
  figureById:       figureById,
  figureImgUrl:     figureImgUrl
};
