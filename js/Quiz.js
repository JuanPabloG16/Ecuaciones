function checkAnswer(questionName) {
    const options = document.getElementsByName(questionName);
    let selectedOption;
    let isOptionSelected = false;
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            selectedOption = options[i].value;
            isOptionSelected = true;
            break;
        }
    }
    if (!isOptionSelected) {
        alert("Por favor selecciona una respuesta");
        return;
    }

    const questionNumber = parseInt(questionName.replace("question", ""));
    let resultMessage;
    let backgroundColor;
    if ((questionNumber === 1 && selectedOption === "A") || 
        (questionNumber === 2 && selectedOption === "B") || 
        (questionNumber === 3 && selectedOption === "C")) {
        resultMessage = "Felicidades, eres muy inteligente";
        backgroundColor = "rgba(106, 194, 89, 0.7)"; // Color verde con transparencia
        if (questionNumber < 3) {
            unlockQuestion(questionNumber + 1); // Desbloquea la siguiente pregunta
        }
    } else {
        resultMessage = "Respuesta Incorrecta";
        backgroundColor = "rgba(239, 68, 68, 0.7)"; // Color rojo con transparencia
    }
    showModal(resultMessage, backgroundColor);
}

function unlockQuestion(questionNumber) {
    const nextQuestion = document.getElementById(`question${questionNumber}`);
    nextQuestion.classList.remove('locked');
}

function showModal(message, backgroundColor) {
    const modal = document.getElementById("result-modal");
    const resultMessageElement = document.getElementById("result-message");
    resultMessageElement.textContent = message;
    modal.style.backgroundColor = backgroundColor; // Cambia el color de fondo del modal
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("result-modal");
    modal.style.display = "none";
    modal.style.backgroundColor = "transparent"; // Restablece el color de fondo del modal
}

function returnToHomePage() {
    window.location.href = "/Paginas/Inicial.html";
}
