/* Teamnaam en Thema */
const startButton = document.getElementById("startButton");
const nameInput = document.getElementById("name");
const teamName = document.getElementById("TeamName");
const playerNameElement = document.getElementById("playerName");
const themeButtons = document.querySelectorAll(".thema__buttons a");

window.onload = function () {
    // Startknop in index.html
    if (startButton && nameInput) {
        startButton.onclick = function () {
            const playerName = nameInput.value.trim();

            if (playerName === "") {
                alert("Vul een naam in om de quiz te starten.");
            } else if (playerName.length > 8) {
                alert("Je naam mag niet langer zijn dan 8 tekens.");
            } else {
                sessionStorage.setItem("playername", playerName);
                window.location.href = "/pages/themascherm.html";
            }
        };
    }

    // Laad spelernaam en themascherm
    const playerName = sessionStorage.getItem("playername");
    if (playerNameElement && playerName) {
        playerNameElement.innerText = playerName;
    }
    if (teamName && playerName) {
        teamName.innerText = "Team: " + playerName;
    }

    // Thema selectie
    themeButtons.forEach(button => {
        button.onclick = function () {
            const theme = this.innerText;
            sessionStorage.setItem("theme", theme);
            window.location.href = "/pages/quizscherm.html";
        };
    });

    // Eindscherm logica
    if (window.location.pathname.includes("eindscherm.html")) {
        loadEndScreen();
    }
};

/* Timer en Quiz Functionaliteit */
let timer;
let tijd = 15; // Tijd per vraag
let quizData = [];
let currentQuestionIndex = 0;
let selectedTheme = sessionStorage.getItem("theme");
let userAnswers = []; // Opslaan van gebruikersantwoorden
let shuffledQuestions = []; // Opslaan van geshuffelde vragen inclusief volgorde

function startTimer() {
    tijd = 15; // Reset tijd voor elke vraag
    updateTimerDisplay();
    timer = setInterval(() => {
        tijd--;
        updateTimerDisplay();

        if (tijd <= 0) {
            clearInterval(timer);
            alert("Tijd is om!");
            saveAnswer(null); // Geen antwoord gegeven
            loadNextQuestion();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.innerText = tijd;
    }
}

// Vraag laden
async function loadQuiz() {
    const response = await fetch("/data/quiz.json");
    const data = await response.json();
    quizData = shuffleArray(data[selectedTheme]); // Shuffle vragen binnen thema
    currentQuestionIndex = 0;
    loadNextQuestion();
}

function loadNextQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
        sessionStorage.setItem("shuffledQuestions", JSON.stringify(shuffledQuestions));
        window.location.href = "/pages/eindscherm.html";
        return;
    }

    const question = quizData[currentQuestionIndex];
    displayQuestion(question);
    currentQuestionIndex++;
    startTimer();
}

function displayQuestion(question) {
    const header = document.querySelector("h1");
    const image = document.querySelector(".quiz-pictures");
    const buttons = document.querySelectorAll(".quiz-button");

    if (header) header.innerText = question.vraag;
    if (image) {
        image.src = question.img;
        image.alt = question.alt;
    }

    // Shuffle antwoorden en sla de volgorde op
    const answers = shuffleArray([...question.antwoorden]);
    shuffledQuestions.push({
        vraag: question.vraag,
        antwoorden: answers,
        correct: answers.indexOf(question.antwoorden[question.correct]),
    });

    buttons.forEach((button, index) => {
        button.innerText = answers[index];
        button.onclick = () => {
            clearInterval(timer); // Stop timer bij klik
            saveAnswer(index); // Antwoord opslaan
            loadNextQuestion(); // Laad volgende vraag
        };
    });
}

function saveAnswer(answerIndex) {
    userAnswers.push(answerIndex);
}

/* Helper functies */
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

/* Eindscherm Functionaliteit */
async function loadEndScreen() {
    // Quizgegevens ophalen
    const response = await fetch("/data/quiz.json");
    const data = await response.json();
    const quizData = data[selectedTheme];
    const maxScore = quizData.length;

    // Antwoorden ophalen
    const userAnswers = JSON.parse(sessionStorage.getItem("userAnswers")) || [];
    const shuffledQuestions = JSON.parse(sessionStorage.getItem("shuffledQuestions")) || [];
    const playerName = sessionStorage.getItem("playername") || "Speler";

    // Score berekenen
    const playerScore = userAnswers.reduce((score, answer, index) => {
        return answer === shuffledQuestions[index].correct ? score + 1 : score;
    }, 0);

    // DOM bijwerken
    document.getElementById("playerName").innerText = playerName;
    document.getElementById("playerScore").innerText = playerScore;
    document.getElementById("maxScore").innerText = maxScore;

    const questionSections = document.querySelectorAll(".question-section");
    questionSections.forEach((section, index) => {
        if (index < shuffledQuestions.length) {
            const question = shuffledQuestions[index];
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correct;

            // Vraag invullen
            section.querySelector(".show-answer").innerText = question.vraag;

            // Antwoorden invullen
            section.querySelector("p:nth-of-type(2) span").innerText =
                question.antwoorden[userAnswer] || "Geen antwoord gegeven";
            section.querySelector("p:nth-of-type(3) span").innerText =
                question.antwoorden[correctAnswer];

            // Correct of fout aangeven
            section.querySelector(".answer").style.display = userAnswer === correctAnswer ? "inline" : "none";
            section.querySelector(".wrong-answer").style.display = userAnswer !== correctAnswer ? "inline" : "none";
        } else {
            section.style.display = "none";
        }
    });
}

/* Quiz starten */
if (window.location.pathname.includes("quizscherm.html")) {
    loadQuiz();
}
