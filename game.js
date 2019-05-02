// game.js






let type = "WebGL"

if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new PIXI.Application();

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight-20);

PIXI.Loader.shared.load(setup);



var state, board, ball, ballRadius;
var brickRowCount;
var brickColumnCount;
var brickWidth;
var brickHeight;
var brickPadding;
var brickOffsetTop;
var brickOffsetLeft;
var bricksGraphics;
var bricks;



// function bricksMaker(){

//     for(var c=0; c<brickColumnCount; c++) {
//         for(var r=0; r<brickRowCount; r++) {
//           if(bricks[c][r].status == 1) {
//             var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
//             var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
//             bricks[c][r].x = brickX;
//             bricks[c][r].y = brickY;
//             bricksGraphics = new PIXI.Graphics();
//             bricksGraphics.beginFill(0x66CCFF);
//             bricksGraphics.drawRect(brickX,brickY, brickWidth, brickHeight);
//             bricksGraphics.endFill();
//             app.stage.addChild(bricksGraphics);

//           }
//         }
//     }
// }


function setup() {
 
     brickRowCount = 7;
     brickColumnCount = 10;
     brickWidth = 75;
     brickHeight = 20;
     brickPadding = 10;
     brickOffsetTop = 30;
     brickOffsetLeft = 30;
     ballRadius = 32;
     bricks = [];

    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
          bricks[c][r];// = //{ x: 0, y: 0, status: 1 };
        }
      }

 board = new PIXI.Graphics();
 board.beginFill(0x66CCFF);
 board.lineStyle(4, 0xFF3300, 1);
 board.drawRect(0, 0, 100, 20);
 board.x = app.screen.width/2 - board.width/2 ;
 board.y = app.screen.height - board.height/2;
 board.vx = 0;
 board.vy = 0;
 board.endFill();
 app.stage.addChild(board);


 ball = new PIXI.Graphics();
 ball.beginFill(0x66CCFF);
 ball.drawCircle(0, 0, 32);
 ball.x = app.screen.width/2;
 ball.y = app.screen.height - board.height - 32;
 ball.vx = -1;
 ball.vy = -1;
 ball.endFill();
 app.stage.addChild(ball);   

 
 for(var c=0; c < brickColumnCount; c++) {
    for(var r=0; r < brickRowCount; r++) {
     // if(bricks[c][r].status == 1) {
        bricks[c][r] = new PIXI.Graphics();
        bricks[c][r].beginFill(0x66CCFF);
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].drawRect(0,0, brickWidth, brickHeight);
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        bricks[c][r].endFill();
        app.stage.addChild(bricks[c][r]);
        //bricks[c][r].visible = false;
        //console.log(bricks[c][r].y)
      }
    }


   

//bricksMaker();

let left = keyboard(37),
      up = keyboard("ArrowUp"),
      right = keyboard(39),
      down = keyboard("ArrowDown");

  //Left arrow key `press` method
  left.press = () => {
    //Change the cat's velocity when the key is pressed
    board.vx = -3;
    board.vy = 0;
  };

  //Right
  right.press = () => {
    board.vx = 3;
    board.vy = 0;
  };

    //Set the game state
    state = play;
 
    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){

    //Update the current game state:
    state(delta);
  }
  
function play(delta) {
  
    //Use the boards's velocity to make it move
    board.x += board.vx;
    board.y += board.vy;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (board.x < 0 || board.x > (app.screen.width - board.width)){
        board.vx = 0;
    }

    if (ball.x < ballRadius || ball.x > (app.screen.width - ballRadius)){
        ball.vx = ball.vx * -1;
    }
    else if (ball.y < ballRadius || ball.y > (app.screen.height - ballRadius)){
        ball.vy = ball.vy * -1;
    }

    for(var c=0; c < brickColumnCount; c++) {
        for(var r=0; r < brickRowCount; r++) {
            if ( bricks[c][r].visible == true){
            if(ball.x + ballRadius > bricks[c][r].x && ball.x + ballRadius < bricks[c][r].x + brickWidth && ball.y + ballRadius > bricks[c][r].y && ball.y + ballRadius < bricks[c][r].y + brickHeight) {
                ball.vy = ball.vy * -1;
                bricks[c][r].visible = false;
            
            }
        }
        }
    }




  }


  //The `keyboard` helper function
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };
    //The `upHandler`
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
  }