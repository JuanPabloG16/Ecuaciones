const questions = [
    {
      id: 1,
      text: "¿Cuántos árboles se mostraron?",
      options: ["4", "5", "3", "6"],
      correctAnswer: "4"
    },
    {
      id: 2,
      text: "¿Cuáles árboles se mostraron?",
      options: ["Pino, Roble, Sauces, Encinos", "Roble, Secuoya, Pino, Abeto", "Secuoya, Pino, Abeto, Nogales", "Bonsai, Sauces, Roble, Abeto"],
      correctAnswer: "Roble, Secuoya, Pino, Abeto"
    },
    {
      id: 3,
      text: "¿Qué representa el ´timelapse´ en el contexto del proyecto de crecimiento arbóreo?",
      options: ["Un método para acelerar el crecimiento de los árboles", "Una visualización rápida del proceso de crecimiento de los árboles a lo largo del tiempo", "Una técnica para reforestar áreas urbanas", "Una animación de cómo plantar árboles"],
      correctAnswer: "Una visualización rápida del proceso de crecimiento de los árboles a lo largo del tiempo"
    },
    {
      id: 4,
      text: "¿Cuál es el árbol más alto del mundo?",
      options: ["Secuoya", "Eucalipto", "Pino", "Abeto"],
      correctAnswer: "Secuoya"
    },
    {
      id: 5,
      text: "¿Qué tecnología se utiliza para visualizar el crecimiento arból en 3D en el proyecto?",
      options: ["WebGL", "Three.js", "Realidad Aumentada", "Timelapse"],
      correctAnswer: "Three.js"
    }
  ];
  
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const submitBtn = document.getElementById('submit-btn');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const dialog = document.getElementById('dialog');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogMessage = document.getElementById('dialog-message');
  
  function shuffleQuestions() {
    currentQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    displayQuestion();
  }
  
  function displayQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    questionText.textContent = `Pregunta ${currentQuestionIndex + 1}: ${question.text}`;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('option');
      optionElement.innerHTML = `
        <input type="radio" id="option${index}" name="answer" value="${option}">
        <label for="option${index}">${option}</label>
      `;
      optionsContainer.appendChild(optionElement);
    });
  }
  
  function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
      showDialog('Error', 'Por favor selecciona una respuesta');
      return;
    }
  
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedOption.value === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      showDialog('¡Correcto!', '¡Felicidades, eres muy inteligente!', 'correct');
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setTimeout(() => {
          currentQuestionIndex++;
          displayQuestion();
        }, 1500);
      }
    } else {
      showDialog('Incorrecto', 'Respuesta Incorrecta', 'incorrect');
    }
  }
  
  function showDialog(title, message, className) {
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    dialog.className = `dialog ${className}`;
    dialog.style.display = 'block';
    setTimeout(() => {
      dialog.style.display = 'none';
    }, 1500);
  }
  
  submitBtn.addEventListener('click', checkAnswer);
  shuffleBtn.addEventListener('click', shuffleQuestions);
  
  // Initialize the quiz
  shuffleQuestions();