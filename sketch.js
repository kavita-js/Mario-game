// Initialize game state
var SERVE = 2;
var PLAY = 1;
var END = 0;
var gameState = SERVE;
//var gameState= PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImg;
var castle, castleImage;

var coinsGroup;
var brickImg, bricksGroup;
var obstacleImg,obstaclesGroup;
var tunnelImg, tunnelGroup;

var score;
//var lives;
var gameOver, restart;


function preload(){
  // load assets of the game
  bg = loadImage("bg.png");
  mario_running =   loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  mario_collided = loadAnimation("collided.png");
  
  coin = loadAnimation("coin2.png", "coin3.png", "coin4.png");
  groundImg = loadImage("ground2.png");
  
  brickImg = loadImage("brick.png");
  castleImage = loadImage("castle.png");
  
  obstacleImg = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  tunnelImg = loadImage("tunnel.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

}

function setup() {
  
  createCanvas(600, 400);
  
  mario = createSprite(150,330);
  
  mario.addAnimation("running",mario_running);
  mario.addAnimation("collided",mario_collided);
  mario.scale = 2;
  //mario.debug=true
  
  ground = createSprite(300,370,600,20);
  ground.addImage("ground",groundImg);
  ground.x = ground.width /2;

  castle = createSprite(50,260,50,50);
  castle.addImage("castle",castleImage);
  castle.scale = 0.4;
  
  gameOver = createSprite(300,200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite(300,240);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(300,340,600,10);
  invisibleGround.visible = false;
  
  coinsGroup = new Group();
  obstaclesGroup = new Group();
  bricksGroup = new Group();
  tunnelGroup = new Group();
 
  score = 0;
  //lives = 5;
}

function draw() {
  
    background(bg);
   
    fill("black");
    textSize(22);
    text("Score: "+ score, 400,30);
    //text("Lives: "+ lives, 400,50);

     if(gameState === SERVE){

      text("Press SPACE to start the game",200,200);

      if(keyDown("space")){
        gameState = PLAY;
      }
    }

  else if (gameState===PLAY){
    castle.destroy();
    // move the ground
      ground.velocityX = -10;
    // infinite scrolling ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

       
    if(score>0 && score%10 === 0){
       checkPointSound.play() 
    }
    
    //console.log(mario.y);
    // jump mario when space key is pressed
    if(keyDown("space") && mario.y >= 297) {
     //if(keyDown("space") ) {
      mario.velocityY = -12;
      jumpSound.play();
    }
    // add gravity
    mario.velocityY = mario.velocityY + 0.5;
  
    spawnCoins();
    spawnObstacles();   
    spawnBricks();
    
    for (var i = 0; i < coinsGroup.length; i++) {
    
      if(coinsGroup.get(i).isTouching(mario)){
        coinsGroup.get(i).remove()
        score = score+1;
    }
    }
    
       // if(bricksGroup.isTouching(mario)){
      //   //bricksGroup.setVelocityYEach(-2);
      //   mario.velocityY = 0;
        
      // }

      if(tunnelGroup.isTouching(mario)){
        //   //bricksGroup.setVelocityYEach(-2);
           mario.velocityY = 0;
          
        }
    
      if(obstaclesGroup.isTouching(mario)){
        // lives = lives - 1;
        gameState = END;
        dieSound.play();
    }
   
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    mario.velocityY = 0;
    
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    tunnelGroup.setVelocityXEach(0);
    //change the animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    tunnelGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
   mario.collide(invisibleGround);
  

  drawSprites();
}

function reset(){
  
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  coinsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  tunnelGroup.destroyEach();

  mario.changeAnimation("running",mario_running);
    
  score = 0;
  
}

function spawnCoins() {
  //write code here to spawn the brick
  if (frameCount % 120  === 0) {
    var coins = createSprite(600,random(120,200));
    coins.addAnimation("coin", coin);
    coins.scale = 0.07;
    //coins.debug = true;
    coins.setCollider("rectangle", 0 , 0, 50, 20);
     
   // brick.addImage(brickImg);
    coins.velocityX = -3;
    
     //assign lifetime to the variable
    coins.lifetime = 300;   
    
    //adjust the depth
    coins.depth = mario.depth;
    mario .depth = mario.depth + 1;
    
    //add each brick to the group
    coinsGroup.add(coins);
  }
  
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    
    var obstacle = createSprite(600,305);
    //obstacle.debug = true;
    obstacle.setCollider("rectangle",0,0,20,20);
    obstacle.addAnimation("obstacles",obstacleImg )
    obstacle.velocityX = -6;
    
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 200;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnBricks() {
  //write code here to spawn the brick
  if (frameCount % 100 === 0) {
    var brick = createSprite(600,random(100,150));
    brick.addImage(brickImg);
    //brick.scale = 0.8;
    //brick.debug = true;
    brick.setCollider("rectangle", 0 , 0, 30,30);
     
   // brick.addImage(brickImg);
    brick.velocityX = -3;
    
     //assign lifetime to the variable
    brick.lifetime = 300;   
    
    //adjust the depth
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;

    var tunnel = createSprite(600,295);
    tunnel.addImage(tunnelImg);
    tunnel.scale = 0.065;
    //tunnel.debug = true;
    tunnel.setCollider("rectangle",0,0,1000,1000);
    tunnel.velocityX = -6;
    tunnel.lifetime = 300;

    tunnelGroup.add(tunnel);
    
    //add each brick to the group
    bricksGroup.add(brick);
  }
  
}

