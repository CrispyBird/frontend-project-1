/* Teamnaam */
window.onload = function() {
    const startButton = document.getElementById("startButton");
    const nameInput = document.getElementById("name");
    const teamName = document.getElementById("TeamName");

    
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
            window.location.href = ""; /* Deze link naar de homepage kan je eraf halen */
        }
    }, 1000);
}

startTimer();

// http://127.0.0.1:5500/index.html */



