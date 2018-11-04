<a name="game-events"/>
### Game Events

<a name="game-events-list"/>

+ __newgame__  
  emitted by newGame() 
+ __gameover__  
  emitted when game is over
+ __saveundo__  
  emitted by saveGame() (for undo)
+ __undo__  
  emitted by undoMove()
+ __swapreserve__  
  emitted by swapReserve()
+ __nextfigure__  
  emitted when next_figure is changed  
  parameter: _fig_
+ __move_begin__  
  emitted at start of userMove()  
  parameter: _fig_ _pos_
+ __move_end__  
  emitted when userMove() successfully finished  
  parameter: _score_, _gold_  
+ __move_fail__  
  emitted when userMove() failed  
  parameter: _fig_ _pos_  
+ __animate_begin__  
  emitted inside userMove() on start of bear and ninja animation  
+ __animate_end__  
  emitted inside userMove() at end of bear and ninja animation  
+ __setfigure__  
  emitted when a figure is set on board  
  parameter: _fig_ _pos_, _score_  
+ __movefigure__  
  emitted inside animation when a bear or ninja is moved  
  parameter: _fig_ _pos_, _newpos_  


#### Sample Game Event
Event data is a object with at least one property _event_ what is the event name.
Some event data have more properties, see _parameter_ in the list [above](#game-events-list).
```
{
  event: 'movefigure',
  fig: 32,
  pos: {x: 1, y: 1},
  newpos: {x: 3, y: 2}
}
```

#### Subscribe Events
```
game.on('movefigure', myAnimation);

function myAnimation (data) {
  var tween = new TWEEN.Tween( ...
}
```

Call function __on(__ _eventName_, _callBackFunction_ __)__
to subscribe a event. You also can subscribe all kinds of events when _eventName_ is 'all':
```
game.on('all', myCallBack);
```

<a name="game-events-logger"/>
#### Logger
There is an internal event listener, the 'logger'. It will print all events to console. 
Use ```game.enableLogger(true)``` for activation.

```
event move_begin fig: bush (2), pos: [0,0]
event setfigure fig: bush (2), pos: [0,0], score: 20
event animate_begin
event animate_end
event nextfigure fig: grass (1)
event move_end fig: bush (2), pos: [0,0], score: 20
```

Use an array of event names to log special events only.

```
var loggedGameEvents = ["move_begin","move_end","move_fail","swapreserve","newgame","gameover","undo"];

game.enableLogger( loggedGameEvents );
```
