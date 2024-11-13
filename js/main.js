// Selecteer het input-veld en de knop
const nameInput = document.getElementById("name");
const startButton = document.getElementById("startButton");
let playerName = "";
const teamName = document.getElementById("TeamName");

// Sla de naam op als variabele wanneer de knop wordt geklikt
startButton.addEventListener("click", () => {
    if (nameInput.value === "") {
        alert("Vul een naam in om de quiz te starten.");
    } else {
        playerName = nameInput.value;
        console.log("Naam van de speler:", playerName);
        window.location.href = "http://127.0.0.1:5500/pages/themascherm.html";

        sessionStorage.setItem(playerName)
        teamName.innerText = playerName;

    };
});

// lukt niet D:

