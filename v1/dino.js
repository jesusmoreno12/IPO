
//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;




//Añado: las imágenes del dinoasurio corriendo, el contador para refrescar y el ratio al que tienen que cambiar las imágenes
let dinoMove1;
let dinoMove2;
let dinoFrame = 0;
let frameSwitchRate = 30;


// Imagen de Game Over
let gameOverImg;
let retryImg;

// Posiciones para el botón de Retry
let retryX, retryY;
let retryWidth = 100; // Asigna el ancho deseado
let retryHeight = 50; // Asigna la altura deseada

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = .2;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // Creo las dos imágenes de movimiento del dinosaurio
    dinoMove1 = new Image();
    dinoMove1.src = "./img/dino-run1.png";

    dinoMove2 = new Image();
    dinoMove2.src = "./img/dino-run2.png";

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    gameOverImg = new Image();
    gameOverImg.src = "./img/game-over.png";

    retryImg = new Image();
    retryImg.src = "./img/reset.png";

    


    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
}



function update() {
    
    requestAnimationFrame(update);
    
    if (gameOver) {

        // Hay que poner un botón de restart 

        // Limpias de todo la pantalla
        context.clearRect(0, 0, board.width, board.height);
        // Dibuja el dinosaurio muerto
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        // Dibuja la pantalla de game over
        context.drawImage(gameOverImg, boardWidth / 2 - gameOverImg.width / 2, boardHeight / 2 - gameOverImg.height / 2); // Centrar la imagen
        //Añade el botón de retry
        // Posicionar botón Retry debajo de la imagen Game Over
        retryX = boardWidth / 2 - retryWidth / 2;
        retryY = boardHeight / 2 + gameOverImg.height / 2 + 20; // Ajuste para estar debajo de "Game Over"
        context.drawImage(retryImg, retryX, retryY, retryWidth, retryHeight);
        return;

    }
    context.clearRect(0, 0, board.width, board.height);



    // Animación del dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // aplica gravedad, sin exceder el suelo


    board.addEventListener("click", function(e) {
        if (gameOver) {
            // Comprobar si el clic está dentro del área del botón Retry
            let mouseX = e.offsetX;
            let mouseY = e.offsetY;
    
            // Verificar si el clic está dentro de las coordenadas del botón
            if (mouseX >= retryX && mouseX <= retryX + retryWidth && mouseY >= retryY && mouseY <= retryY + retryHeight) {
                restartGame();
            }
        }

        function restartGame() {
            // Restablecer las variables del juego
            gameOver = false;
            score = 0;
        
            // Restablecer la posición del dinosaurio
            dino.y = dinoY;
            velocityY = 0;
        
            // Vaciar el array de cactus
            cactusArray = [];
        
            // Reiniciar la imagen del dinosaurio
            dinoImg.src = "./img/dino.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        
        }
    });







    // Incrementa y resetea el contador de frames
    if (dino.y === dinoY) { // Solo cambia frames si está en el suelo
        dinoFrame = (dinoFrame + 1) % (frameSwitchRate * 2); // Cambia entre 0 y frameSwitchRate * 2
    }
    
     // Selecciona la imagen del dinosaurio
    let currentDinoImg = dino.y < dinoY ? dinoImg : (dinoFrame < frameSwitchRate ? dinoMove1 : dinoMove2);
    context.drawImage(currentDinoImg, dino.x, dino.y, dino.width, dino.height);

    // Incrementa y resetea el contador de frames
    if (dino.y === dinoY) { // Solo cambia frames si está en el suelo
        dinoFrame = (dinoFrame + 1) % (frameSwitchRate * 2); // Cambia entre 0 y frameSwitchRate * 2
    }





    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground




    //Aquí hay que hacer a los pteranodones




    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -8;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}


//Aquí hay que poner a los pteranodones




function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}