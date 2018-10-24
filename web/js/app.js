 app = angular.module('myApp', []);
 app.controller('myCtrl',  ['$scope', function($scope) {
    
//app = angular.module('myApp', ['ngCookies']);
//app.controller('MyController',['$scope','$cookies','$cookieStore',     
//  function($scope,$cookies,$cookieStore) {            
  

   // init controler  
  $scope.clicked = '0,0';
  $scope.game = new module.Game();
  $scope.gridRowSet = [];
  $scope.gridColSet = [];
  for(let i=0; i < $scope.game.board.cols; i++) $scope.gridColSet.push(i);
  for(let i=0; i < $scope.game.board.rows; i++) $scope.gridRowSet.push(i);
  loadGame($scope.game);
  $scope.game.enableLogger(["move_begin","move_end","move_fail","swapreserve","newgame","gameover","undo"]);




    // get image for figure
  $scope.getImageUrl = function(x,y) {
    return figureImg($scope.game.board.get(x,y));
  };
  
  // next figure
  $scope.placeNextImg = function(x,y) {
    return figureImg( $scope.game.nextFigure() );
  };

  $scope.placeNext = function(x,y) {
    return $scope.game.nextFigure();
  };
  
  // user move  
  $scope.doClick = function(x,y) {
    $scope.clicked = '' + x + ', ' + y;
console.log('doClick', $scope.clicked);   
    $scope.game.userMove(x,y);
    saveGame($scope.game);
  };
  
  
  // get reserve
  $scope.reserveImg = function() {
    return figureImg( $scope.game.reserve() );
  };
    
  // set reserve
  $scope.swapReserve = function() {
    return $scope.game.swapReserve();
  };
    
  $scope.undoMove = function () {
    $scope.game.undoMove();
  };
  
    
  
}]);











    
  function figureImg( fig ) {
    var path1 = './img/';
    var path2 = './img/figures/';
    var f;
    switch (fig) {
//      case 0: f = path2 + 'ground'; break;
      case 0: f = path2 + '0'; break;
      case 1: f = path2 + 'grass'; break;
      case 2: f = path2 + 'bush'; break;
      case 3: f = path2 + 'tree'; break;
      case 4: f = path2 + 'hut'; break;
      case 5: f = path2 + 'house'; break;
      case 6: f = path2 + 'mansion'; break;
      case 7: f = path2 + 'castle'; break;
      case 8: f = path2 + 'floatingcastle'; break;
      case 9: f = path2 + 'triplecastle'; break;
      case 20: f = path2 + 'rock'; break;
      case 21: f = path2 + 'mountain'; break;
      case 25: f = path2 + 'robot'; break;
      case 26: f = path2 + 'crystal'; break;
      case 30: f = path2 + 'bear'; break;
      case 31: f = path2 + 'tomb'; break;
      case 32: f = path2 + 'ninja'; break;
      case 40: f = path2 + 'church'; break;
      case 41: f = path2 + 'cathedral'; break;
      case 50: f = path2 + 'treasure'; break;
      case 51: f = path2 + 'bigtreasure'; break;
      default: f = path1 + fig;  
        console.log('figureImg('+fig+')');
    }
    
    return f + '.png';
  }
  





function saveGame( game ) {
console.log('saveGame start');
  if (typeof(Storage) === "undefined") return;
  var status = JSON.stringify(game.getState());
  localStorage.savedGame = status;
console.log('saveGame end');
}

function loadGame( game ) {
console.log('loadGame start');
  if (typeof(Storage) === "undefined") {
    console.log('Storage not suported');
    return;
  }
  var status = localStorage.savedGame;
//console.log(JSON.stringify(status,null,2));
console.log('load game status:',status);
  try {
    status = JSON.parse(status);
//console.log(JSON.stringify(status.board,null,2));
    if (!status.board) return;
//console.log(status.name);
//console.log(status.board_size);
   if (status) game.setState(status);
//console.log('game board:',JSON.stringify(game.board,null,2));
   
console.log('loadGame end');
    
  } catch (e) {
    localStorage.savedGame = null;
    console.log(e);
  }

}




/*
* https://stackoverflow.com/questions/10961963/how-to-access-cookies-in-angularjs
* 
* 
 */