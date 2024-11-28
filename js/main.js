/* Teamnaam */
const startButton = document.getElementById("startButton");
const nameInput = document.getElementById("name");
const teamName = document.getElementById("TeamName");

window.onload = function() {
    if (startButton && nameInput) {
        startButton.onclick = function() {
            const playerName = nameInput.value;

            if (playerName === "") {
                alert("Vul een naam in om de quiz te starten.");
            } else {
                sessionStorage.setItem("playername", playerName);
                window.location.href = "http://127.0.0.1:5500/pages/themascherm.html";
            }
        };
    }

    const playerName = sessionStorage.getItem("playername");

    if (teamName && playerName) {
        teamName.innerText = "Team: " + playerName;
    }
};

/* Timer */
let timer;
let tijd = 16;

function startTimer() {
    timer = setInterval(function() {
        tijd--;
        document.getElementById("timer").innerText = tijd;

        if (tijd <= 0) {
            clearInterval(timer);
            window.location.href = ""; // Vervang met je gewenste actie
        }
    }, 1000);
}

// startTimer();

/* Spelersnaam */
const player_Name = document.getElementById("playerName");

if (startButton && nameInput) {
    startButton.onclick = function() {
        const playerName = nameInput.value;

        if (playerName === "") {
            alert("Vul een naam in om de quiz te starten.");
        } else {
            sessionStorage.setItem("playername", playerName);
            window.location.href = "http://127.0.0.1:5500/pages/themascherm.html";
        }
    };
}

const playerName = sessionStorage.getItem("playername");

if (player_Name && playerName) {
    player_Name.innerText = playerName;
}

/* Input Characters */
const name_Input = document.getElementById('name');
if (name_Input) {
    name_Input.setAttribute('maxlength', '8');
    name_Input.addEventListener('input', () => {
        document.getElementById('charCount').innerText = `${name_Input.value.length}/8`;
    });
}

/* Quiz Logica */
const thema1 = document.querySelector('.thema__1');
const thema2 = document.querySelector('.thema__2');
const thema3 = document.querySelector('.thema__3');
const quizHeader = document.querySelector('h1');
const quizButtons = document.querySelectorAll('.quiz-button');

// Laad de JSON data
let quizData;

fetch('/path/to/quizvragen.json') // Verander dit pad naar je JSON-bestand
    .then(response => response.json())
    .then(data => {
        quizData = data;
    });

function laadQuiz(thema) {
    const vragen = quizData[thema];
    const vraag = vragen[Math.floor(Math.random() * vragen.length)];

    quizHeader.innerText = vraag.vraag;
    quizButtons.forEach((button, index) => {
        button.innerText = vraag.antwoorden[index];
        button.onclick = () => {
            if (index === vraag.correct) {
                alert('Correct!');
            } else {
                alert('Fout, probeer opnieuw!');
            }
        };
    });
}

if (thema1) thema1.onclick = () => laadQuiz('Dieren');
if (thema2) thema2.onclick = () => laadQuiz('Software Development');
if (thema3) thema3.onclick = () => laadQuiz('Landen');
