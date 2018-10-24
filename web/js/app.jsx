/* 
 * Copyright (C) 2018 wcs <wcs at willicommer.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


// import Triple Game
const TRIPLE_FIG = module.TRIPLE_FIG;
const Game = module.Game;
const Pos = module.Pos;


function LabelText (txt) { 
  return (<h4>{txt}</h4>);
};

function FigImg (fig) {
  return (
    <img src={figureImgUrl(fig)} className="game-img-64" /> 
  );
};

function FigImgLab (props) {
  let fig = props.fig === 0 ? 'none' : props.fig;
  return (
    <div onClick={props.onClick}>      
      {LabelText(props.label)}
      {FigImg(fig)}
    </div>
  );
};

function Score (label, value) {
   if (value === 0) value = '';
   return LabelText(label + " " + value);
};


function ButtonCol (props) {
  let classname = 'btn btn-success';
  let disabled = props.disabled ? true : false;
  return (
    <div className="col" key={props.key}>
      <button type="button" className={classname} disabled={disabled} onClick={props.onClick}>{props.label}</button>
    </div>
  );        
};

  
class ControlPanel extends React.Component {
  
  render () {
    return [
      ButtonCol({
        key:      'undo',
        label:    'Undo',
        onClick:  this.props.undoClick,
        disabled: this.props.undoDisable
      }),
      ButtonCol({
        key:      'shop',
        label:    'Shop',
        onClick:  this.props.shopClick,
        disabled: true
      }),
      ButtonCol({
        key:      'new',
        label:    'New Game',
        onClick:  this.props.newgameClick,
        disabled: false
      })
    ];
   }  
};
  
  
class GameBoard extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
   handleClick(pos) {
    console.log('Click happened at',pos.x,pos.y);
    this.props.boardClick(pos);
  }
  
  render () {
    let rows = [];
    let game = this.props.game;
    let board = this.props.game.board;
    if (!board) return 'Empty Board';
//console.log(board);    
    for (let y=0; y < board.rows; y++) {
      let cells = [];
      for (let x=0; x < board.rows; x++) {
        let fig = board.get(x,y);
        let pos = new Pos(x,y);
        let legal = game.isLegalMove(pos);
        let cell;
        if (legal) {
          cell = (
            <td key={pos.key}>
              <div className="grid-cell-ok" onClick={(e) => this.handleClick(pos,e)}>
              {FigImg(fig)}
              </div>
            </td>
          );      
        } else {
          cell = (
            <td key={pos.key}>
              <div className="grid-cell">
              {FigImg(fig)}
              </div>
            </td>
          );     
       }
       cells.push(cell);
      };
      let row = <tr key={y}>{cells}</tr>;
      rows.push(row);
    };
   
    return (
      <table className="game-grid">
        <tbody>{rows}</tbody>
      </table>
    );
  }
};


class TripleGame extends React.Component {
  
  constructor(props) {
    super(props);
    let g = new Game();
    g.enableLogger(loogedGameEvents);
    loadGame(g);
    this.state = {
      game: g,
      gameState: g.getState()
    };
    this.boardClick = this.boardClick.bind(this);
    this.reserveClick = this.reserveClick.bind(this);
    this.undoClick = this.undoClick.bind(this);
    this.newgameClick = this.newgameClick.bind(this);
    this.shopClick = this.shopClick.bind(this);
  }

  updateState () {
    this.setState({
      gameState: this.state.game.getState()
    });
    saveGame(this.state.game);
  }
  
  boardClick (pos) {
    this.state.game.turn(pos);
    this.updateState();
  }
  
  reserveClick () {
    this.state.game.swapReserve();
    this.updateState();
  }

  undoClick () {
    this.state.game.undoMove();
    this.updateState();
  }
  
  newgameClick () {
    this.state.game.newGame();
    this.updateState();
  }

  shopClick () {
  }


  render() {
    let game = this.state.game;
    let gameState = this.state.gameState;
    let undoDisable = !gameState.undo_enable;
// console.log(gameState);    
    return (
      <div className="container">    
        <div className="row">
          <div className="col border">
            <GameBoard game={game} boardClick={this.boardClick}/>
          </div>
          <div className="col">
            <div className="container">    
              <div className="row">
                <div className="col border">
                  <FigImgLab label="Place" fig={gameState.next} onClick={this.reserveClick}/>
                </div>
                <div className="col border">
                  <FigImgLab label="Reserve" fig={gameState.reserve} onClick={this.reserveClick}/>
                </div>
              </div>
              <div className="row">
                <div className="col border">
                  {Score("Score", gameState.score)}
                </div>
                <div className="col border">
                  {Score("Gold", gameState.gold)}
                </div>
              </div>
              <div className="row">
                <div className="col border">
                  {Score("Moves", gameState.move_count)}
                </div>
              </div>
              <div className="row">
                  <ControlPanel game={game} undoClick={this.undoClick} newgameClick={this.newgameClick} shopClick={this.shopClick} undoDisable={undoDisable}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  
};


function figureImgUrl( fig ) {
  let path = './img/figures/';
  let f = ImageFileMap[fig] || ImageFileMap.default;
  return path + f;
}

var ImageFileMap = {
  "0": "0.png",
  "1": "grass.png",
  "2": "bush.png",
  "3": "tree.png",
  "4": "hut.png",
  "5": "house.png",
  "6": "mansion.png",
  "7": "castle.png",
  "8": "floatingcastle.png",
  "9": "triplecastle.png",
  "20": "rock.png",
  "21": "mountain.png",
  "25": "robot.png",
  "26": "crystal.png",
  "30": "bear.png",
  "31": "tomb.png",
  "32": "ninja.png",
  "40": "church.png",
  "41": "cathedral.png",
  "50": "treasure.png",
  "51": "bigtreasure.png",
  "default": "none.png",
  "none": "none.png"
};


var loogedGameEvents = ["move_begin","move_end","move_fail","swapreserve","newgame","gameover","undo"];

function myGameLogger (txt, data) {
  if (loogedGameEvents.indexOf(data.event))
    console.log('-game', txt);
};
  
var saveGameKey = 'TripleGame';

function saveGame( game ) {
  if (typeof(Storage) === "undefined") return;
  var status = JSON.stringify(game.getState());
  localStorage[saveGameKey] = status;
}

function loadGame( game ) {

  if (typeof(Storage) === "undefined") {
    console.warn('Storage not suported');
    return;
  }
  
  var status = localStorage[saveGameKey];
  console.log('load game status:',status);
  try {
    status = JSON.parse(status);
    if (!status || !status.board) return;
    if (status) game.setState(status);
  } catch (e) {
    localStorage.savedGame = null;
    console.log('loadGame',e);
  }

}

