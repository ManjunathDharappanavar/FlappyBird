// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird 
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// pipes
let pipeArray = [];
let pipewidth = 64;
let pipeHeight = 516;
let pipeX = boardWidth;;
let pipeY = 0;


let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0; // how fast bird is falling
let gravity = 0.2;
let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); // used for drawing on the board

    // context.fillStyle = "red";
    context.fillRect(bird.x, bird.y, birdWidth, birdHeight);

    // load bird image
    birdImg = new Image();
    birdImg.src = "bird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);
    }
    topPipeImg = new Image();
    topPipeImg.src = "topPipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottomPipe.png";



    this.requestAnimationFrame(update);
    this.setInterval(placePipes, 1500);

    this.document.addEventListener("keydown", moveBird);

    // Mobile touch controls
board.addEventListener("touchstart", function(e) {
    e.preventDefault();
    velocityY = -6;

    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        velocityY = 0;
        gameOver = false;
    }
}, { passive: false });

}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, boardWidth, boardHeight);  


    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(Math.min(bird.y + velocityY, boardHeight - bird.height), 0);
    context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);

    if(bird.y > board.height){
        gameOver = true;
    }

    //pipes
    for (let i = 0; i<pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;

        // top pipe
        context.drawImage(pipe.img, pipe.x, pipe.y, pipewidth, pipeHeight);

        if(!pipe.passed && pipe.x + pipewidth < bird.x) {
            score+= 0.5;
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)) {
            gameOver = true;
            playRandomSound();
        }

        // clear pipes
        while(pipeArray.length > 0 && pipeArray[0].x < -pipewidth) {
            pipeArray.shift();
        }
    }

    // score
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 25);

    if(gameOver){
        context.fillText("Game Over!", 10, 50);
    }
}

function placePipes() {

   let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);
    let openingSpace = boardHeight/4;
    // bottom pipe

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipewidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipewidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe);
}


function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        velocityY = -6;
    }

    if(gameOver){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        velocityY = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
       a.x + a.width > b.x &&    
       a.y < b.y + b.height &&
       a.y + a.height > b.y;

}


// sounds
gameOverSound = [
    new Audio("araara1.mp3"),
    new Audio("araara2.mp3")
]

function playRandomSound() {
    let i = Math.floor(Math.random() * gameOverSound.length);
    gameOverSound[i].play();
}