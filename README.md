# Triple Game

[![npm version](https://badge.fury.io/js/triple-game.svg)](https://badge.fury.io/js/triple-game)
[![GitHub version](https://badge.fury.io/gh/willicommer%2Ftriple-game.svg)](https://badge.fury.io/gh/willicommer%2Ftriple-game)
[![wcs badge](http://familiecommer.de/files/img/author-wcs-blue.svg)](http://WilliCommer.de)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

>  
> Javascript game like triple town
>  


## Installation
```
npm install triple-game
```

## Docs

+ [Triple Game API][TripleGameApi]
+ [Game Event API][game-events]


## Module
```
const game = require('triple-game');
```

| export | decription |
|-------|----|
| Game           | game engine class |
| TripleGame     | same as game |
| Pos            | class Pos |
| Board          | class Board |
| TRIPLE_FIG     | figure constant definitions |
| figures        | figure definitions |
| figureProp     | function |
| figureList     | function |
| figureById     | function |
| figureImgUrl   | function |

## Use the bundle

The bundle sets global variable _TripleGame_.

```html
<script src="js/triple-game-20-bundle.js" type="text/javascript" />

<script type="text/javascript">
  
  var game = new TripleGame.Game();
  const FIG = TripleGame.TRIPLE_FIG;
  game.userMove(1,1, FIG.BUSH);

</script>
```

  
## Scripts
- __start__   
  runs a console game
- __test__   
  runs mocha test
- __bundle__   
  create bundle.js into /web/js folder



## Play

#### Start a console game
```
npm start
```

#### Start browser game (angular)

[demo/html-angular/index.html][demo-angular] 

#### Start browser game (react)

[demo/html-react/index.html][demo-react]

## Related

A three.js game with triple-game [Triple Three][Triple Three]


## License

__MIT__

## History
+ 2.0.5 add bundle and remove inputloop from dependencies
+ 2.0.4 bugfix


[Triple Three]: https://github.com/WilliCommer/TripleThree
[TripleGameApi]: docs/TripleGameApi.html
[game-events]: docs/game-events.html
[demo-angular]: demo/html-angular/index.html
[demo-react]: demo/html-react/index.html



