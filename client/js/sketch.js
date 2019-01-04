let gameObject = initState;
let letterRack = new LetterRack();
let playfield = new Playfield();

// Getting the last character in the url which is the player number
// Temporary, will be removed when websockets are implemented
const playerNumber = String(document.location)[String(document.location).length-1];

function preload() {
    getJson();
}

function setup() {
    setCss();
    setScores();

    const canvasDiv = document.getElementById("playfield");
    let canvas = createCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
    canvas.parent("playfield");
    background(45);
    letterRack.manageLetters();

    letterRack.width  = width / 11;
    playfield.width   = width * 0.7528;
    playfield.height  = height * 0.9256;
    letterRack.height = playfield.height * 0.1148;

}

function playButton() {
    console.log("PLAY!");
    getJson();
}

function endButton() {
    console.log("END!");
    setCss();
    setScores();
    giveUp();
}

function getJson() {
    console.log(playerNumber);
    gameObject = loadJSON("/getp" + playerNumber + "/all");
}

function setCss() {
    if (gameObject) {
        const currentTurn = gameObject.game.currentTurn;
        const player1 = document.getElementById("player1Score");
        const player2 = document.getElementById("player2Score");

        let me;
        for (let i = 0; i < gameObject.game.players.length; i++) {
            if (gameObject.game.players[i].isYou) {
                me = i;
                break;
            }
        }

        if (currentTurn == 0) {
            // Player 1's turn
            player1.classList.add("activePlayer");
            player2.classList.remove("activePlayer");
        } else {
            // Player 2's turn
            player1.classList.remove("activePlayer");
            player2.classList.add("activePlayer");
        }

        const playButtonDiv = document.getElementById("playButton");
        const playButtonText = document.getElementById("playButtonText");
        
        if (currentTurn == me) {
            playButtonDiv.classList.remove("oppoTurn");
            playButtonDiv.classList.add("myTurn");
            playButtonText.classList.remove("oppoTurn");
            playButtonText.classList.add("myTurn");
            
            playButtonDiv.onclick = () => playButton();
        } else {
            playButtonDiv.classList.add("oppoTurn");
            playButtonDiv.classList.remove("myTurn");
            playButtonText.classList.add("oppoTurn");
            playButtonText.classList.remove("myTurn");
            
            playButtonDiv.onclick = () => console.log("Deactivated");
        }
    }
}

function setScores() {
    if (gameObject) {
        const p1Element = document.getElementById("player1ScoreP");
        const p2Element = document.getElementById("player2ScoreP");
        const p1Points = gameObject.game.players[0].points;
        const p2Points = gameObject.game.players[1].points;
        p1Element.innerHTML = p1Points + "p";
        p2Element.innerHTML = p2Points + "p";
    }
}

function giveUp() {
    let route = "/winner/";
    if (playerNumber == "1") {
        route += "2";
    } else if (playerNumber == "2") {
        route += "1";
    }

    const formElement = document.getElementById("giveUpForm");
    formElement.action = route;
    formElement.submit();

}

function draw() {
    letterRack.show();
    playfield.show();
}
