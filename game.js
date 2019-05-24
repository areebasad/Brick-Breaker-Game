//============================================================================
// Name        : game.js
// Authors      : Hafiz Areeb Asad, Hamza Imran syed
// Version     : 1.0
// Copyright   : (c) Reserved
// Date Created: 2nd May, 2019
// Last updated: 8th May, 2019
// Description : Implements Brick Breaker Game using Pixi2js as canvas(game engine)
//                 
// Requires    : game.html, jquery API 
// Known Issues: All fixed, No so far
//=============================================================================

let type = "WebGL"

if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

//PIXI.utils.sayHello(type)

//Create a Pixi Application
let app = new PIXI.Application();

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(700, 600);
//app.renderer.resize(window.innerWidth, window.innerHeight-20);

PIXI.Loader.shared.load(setup);


// Declare variables to be used in game
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
var BoardCenterX;
var BoardCenterY;
var BrickCenterX;
var BrickCenterY;
var ditanceX;
var distanceY;

// Get Random Color value in Hexa 
function getRandomColor() {
  var letters = '0123456789ABCDEF'; //0123456789A
  var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  return color;
}



function setup() {
 
     brickRowCount = 7;
     brickColumnCount = 10;
     brickWidth = 75;
     brickHeight = 20;
     brickPadding = 10;
     brickOffsetTop = 30;
     brickOffsetLeft = 30;
     ballRadius = 20;
     bricks = [];

    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
          bricks[c][r];// = //{ x: 0, y: 0, status: 1 };
        }
      }

  // Draw game board     
  board = new PIXI.Graphics();
  board.beginFill(0xfb435c);
  //board.lineStyle(4, 0xFF3300, 1);
  board.drawRect(0, 0, 100, 20);
  board.x = app.screen.width/2 - board.width/2 ;
  board.y = app.screen.height - board.height/2;
  board.vx = 0;
  board.vy = 0;
  board.endFill();
  app.stage.addChild(board);                      // Add on the Canvas

  // Draw ball
  ball = new PIXI.Graphics();
  ball.beginFill(getRandomColor()); //0xB22222
  ball.drawCircle(0, 0, ballRadius);
  ball.x = app.screen.width/2;
  ball.y = app.screen.height - board.height - ballRadius;
  ball.vx = -2;
  ball.vy = -2;
  ball.endFill();
  app.stage.addChild(ball);                       // Add on the Canvas

 
  // Draw Bricks    
  for(var c=0; c < brickColumnCount; c++) {
    for(var r=0; r < brickRowCount; r++) {
        
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        
        bricks[c][r] = new PIXI.Graphics();
        bricks[c][r].beginFill(getRandomColor()); //c4a851
        bricks[c][r].drawRect(0,0, brickWidth, brickHeight);
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        bricks[c][r].endFill();
        app.stage.addChild(bricks[c][r]);
      }
    }


   
let left = keyboard(37),
      up = keyboard("ArrowUp"),
      right = keyboard(39),
      down = keyboard("ArrowDown");

  //Left arrow key `press` method
  left.press = () => {
    //Change the cat's velocity when the key is pressed
    //board.vx = -7;
    //board.x += board.vx;
    board.vx = -2;
    board.vy = 0;
  };

  //Right
  right.press = () => {
    //board.vx = 20;
    //board.x += board.vx;
    board.vx = 2;
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

    // Check Board collision with Walls
    if (board.x < 0 || board.x > (app.screen.width - board.width)){
        board.vx = 0;
    }

    // Check Ball collision with walls
    if (ball.x < ballRadius || ball.x > (app.screen.width - ballRadius)){
        ball.vx = ball.vx * -1;
    }
    else if (ball.y < ballRadius || ball.y > (app.screen.height - ballRadius)){
        ball.vy = ball.vy * -1;
    }


    // Calculate distance to check collision of ball with board(Paddle)
    BoardCenterX = board.x + board.width/2;
    BoardCenterY = board.y + board.height/2
    distanceX = Math.abs( BoardCenterX - ball.x)  - (board.width/2 + ballRadius);
    distanceY = Math.abs( BoardCenterY - ball.y)  - (board.height/2 + ballRadius);

    // Check collision of ball with board(Paddle)
    if (distanceX < 0 && distanceY < 0)  // Collision Test
    {
      if (distanceX < distanceY)         // Penetration Test
        ball.vy = ball.vy * -1;
        
      else 
        ball.vx = ball.vx * -1;
    }

    
    // Check bricks collision with ball
    for(var c=0; c < brickColumnCount; c++) {
        for(var r=0; r < brickRowCount; r++) {
            if ( bricks[c][r].visible == true){
            
              BrickCenterX = bricks[c][r].x + brickWidth/2;
              BrickCenterY = bricks[c][r].y + brickHeight/2;

              distanceX = Math.abs( BrickCenterX - ball.x)  - (brickWidth/2 + ballRadius);
              distanceY = Math.abs( BrickCenterY - ball.y)  - (brickHeight/2 + ballRadius);  

              if (distanceX < 0 && distanceY < 0)   // Collision Test
              {
                  if (distanceX <= distanceY){      // Penetration Test
                      ball.vy = ball.vy * -1;
                      ball.tint = getRandomColor();
                      bricks[c][r].visible = false;
                  }
                  else{ 
                      ball.vx = ball.vx * -1;
                      ball.tint = getRandomColor();
                      bricks[c][r].visible = false;
                  }
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