//Global variables
let seconds=0; //Variable for the timer to show seconds.
let tCounter=30; // Variable to specify the amount of time allotted for the game.
let gameTime; // Variable for setTimeout/clearInterval functions
let gameON = true; //A flag that allows/prevents any keyboard input while the modal windows are active.

//
// The Enemy class
//
class Enemy {
  constructor(x,y, speed){
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  update(dt){
    this.x += this.speed*dt;
    if (this.x >505) {
      this.x=-200;
    };
  }
}

//
// The Player class
//
class Player {
  constructor(x,y){
    this.sprite = 'images/char-boy.png';
    this.stepX = 101;
    this.stepY = 83;
    this.startX = 202;
    this.startY = 404;
    this.x = this.startX;
    this.y = this.startY;
    this.win=0;
    this.life =5;
  }
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(playerMoves){
    switch(playerMoves){
      case 'left':
        if ((this.x-this.stepX)>=0){this.x -=this.stepX}
        break;
      case 'right':
        if ((this.x+this.stepX)<=404){this.x +=this.stepX}
        break;
      case 'up':
        if ((this.y-this.stepY) >= -11){this.y -=this.stepY}
        break;
      case 'down':
        if ((this.y+this.stepY) <= 404){this.y +=this.stepY}
        break;
    }
    //console.log(player.x + "," + player.y);
  }
  update() {
    for(let enemy of allEnemies) { //Check if player collides with each of the enemy bugs.
        if(this.y === enemy.y+7){ // Check if player is on the same y-axis(+offset) with enemy
          if (this.x<enemy.x+50 && this.x +50> enemy.x) { // Check if player and enemy on same x location(+offset)
            //console.log("Collided with the bugs!");
            this.life=this.life-1; // Collided with the enemy; decrease life count by 1.
            //console.log("player.life= " + this.life);

            let plyrLife = document.getElementById("playerLife");
            plyrLife.textContent=this.life;  // Write the player life value.

            if(this.life===0){//Game over! No more life
                endTheGame(2); //End the Game and select option the option on no more life (c=2).
            }
            init_player(); // if player collided with the enemy, reset the player and princess positions.
            init_girl();
       }
      }
    }

    // If player reached the water: get princess, or move player on the water.
    if ((this.y === girl.y) &&(this.x === girl.x)) {
      //console.log("Got the girl!");
      player.sprite = "images/char-boy-princess.png"; //Change sprite of boy to show he's carrying the girl.
      girl.x = -505; //put princess out of the canvass
      girl.y = -94; //put princess out of the canvass
    }
    //If player with the princess reach the grass, reset player sprite to "boy", reset position of the girl.
    // Doesn't matter what the value of player.x, as long as the player reach y-axis at 404.
    if (player.y === 404 && player.sprite==="images/char-boy-princess.png") {
      player.sprite = "images/char-boy.png";
      girl.x = girl_coordinates(0,4); //reset girl position
      girl.y = -11;
      //console.log("win!");
      girl.count++;
      //console.log("girl count= "+ girl.count);

      let winGirl=document.getElementById("girlCount");
      winGirl.textContent= girl.count;
      //console.log("girl count= "+ girl.count);
      if (girl.count>=4) {
        endTheGame(0);
      }
    }
  }
}


//
//The Girl/Princess class
//
class Girl {
  constructor(x,y){
    this.sprite = "images/char-princess-girl.png";
    this.x = x;
    this.y = y;
    this.count =0;
  }
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

//Initialize and instantiate entities
const player = new Player();

const girl = new Girl(girl_coordinates(0,4),-11);

const enemy1 = new Enemy(2,65,  randomSpeed(100,250));
const enemy2 = new Enemy(2,148, randomSpeed(100,250));
const enemy3 = new Enemy(2,231, randomSpeed(100,250));
const enemy4 = new Enemy(2,314, randomSpeed(100,250));
const allEnemies = [];
allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
allEnemies.push(enemy4);

//Welcome modal window function
function welcomeWindow(){
  let welcome = document.getElementsByClassName("welcomeModal");
  let modalText = document.getElementsByClassName("modalOpenWinText");
  let beginBtn = document.getElementById("startGame");

  welcome[0].style.display = "block";
  gameON = false;
  beginBtn.onclick = function(){
    welcome[0].style.display = "none";
    initGame();
  }
}

//Initialize the Game - set default coordinates of player and princess, set timer to 30 seconds, and start the timer countdown.
function initGame(){
  init_player();
  init_girl();
  player.life = 5;
  girl.count = 0;
  tCounter = 30;
  gameON = true;
  startTime();

  let plife = document.getElementById("playerLife");
  let girlCount = document.getElementById("girlCount");
  let timer = document.getElementById("timer");

  plife.textContent = player.life;
  girlCount.textContent = girl.count;
  timer.textContent = tCounter;
}

//Function to handle when the game ends in three states: Won, time ran out, used up all available player life.
//c - used as a variable in the switch statement to determine which state is the end game.
function endTheGame(c){
  let endGame = document.getElementById("modalEnd");
  let endBtn = document.getElementById("rBtn");
  let endText = document.getElementsByClassName("modalText");

  gameON = false;
  endGame.style.display = "block"; // Show the modal end game window.
  stopTime();

  switch(c){
    case 0:
      endText[0].textContent="Good job! You rescued the " + girl.count + " Princesses.";
      break;
    case 1:
      endText[0].textContent="Sorry, time is up. You only rescued " + girl.count + " Princesses.";
      break;
    case 2:
      endText[0].textContent="Sorry, you used up all the lives available.";
      break;
   }

   endBtn.onclick = function(){
      endGame.style.display = "none";
      gameON = true;
      initGame();
  }
}

// Initialize player entity
function init_player(){
  player.x = 202;
  player.y = 404;
  player.sprite="images/char-boy.png";
  //player.life = 5;
}

// Initialize girl/princess entity
function init_girl(){
  girl.x = girl_coordinates(0,4);
  girl.y = -11;
  //girl.count = 0;
}

//Set girl's x-coordinate. y-coordinate is always at 4 (water area).
function girl_coordinates(min, max){
  let pos = Math.floor(Math.random() * (max - min + 1)) + min;
  let abs_pos =pos + (pos*100);
  return abs_pos; // return the x-coordinate of girl location.
}

//Get some random value for Enemy's speed.
function randomSpeed(min,max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Game countdown timer.
function startTime(){
  gameTime= setInterval(timeCounter, 1000);
  //console.log("time started!");
}

//timeCounter() function translates the computed tcounter to 2-digit seconds equivalent.
function timeCounter(){
  let time = document.getElementById("timer");
  seconds = tCounter  % 60;
  if (seconds<10){
    seconds = "0" + seconds ;
  }
  time.textContent = seconds;

  tCounter--;
  if (tCounter<0){
    endTheGame(1);  // (1)- means the player lost because of the lack of time to complete the game.
  }
    //console.log("tCounter="+tCounter);
}

//Function to stop the countdown timer.
function stopTime(){
  clearInterval(gameTime);
}

//Add event listener to process the arrow key inputs
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };
  if (gameON===true){ //keyboard input for the player will be processed only when modal windows are not active.
    player.handleInput(allowedKeys[e.keyCode]);
  }
});

//Start the game by opening the welcome modal window!
welcomeWindow();
