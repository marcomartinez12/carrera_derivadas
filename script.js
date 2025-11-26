// Espera a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {

    // --- Variables del Banco de Preguntas (Nivel Bajo-Medio) ---
    const questions = [
        { f: "f(x) = 5", options: ["5", "1", "0", "x"], correct: 2 },
        { f: "f(x) = x³", options: ["3x²", "x²", "3x", "x⁴"], correct: 0 },
        { f: "f(x) = 4x", options: ["4x", "x", "4", "0"], correct: 2 },
        { f: "f(x) = 2x²", options: ["2x", "4x²", "4", "4x"], correct: 3 },
        { f: "f(x) = x + 6", options: ["1", "0", "x", "6"], correct: 0 },
        { f: "f(x) = 5x³", options: ["15x²", "5x²", "15x", "3x²"], correct: 0 },
        { f: "f(x) = 100", options: ["100", "0", "1", "x"], correct: 1 },
        { f: "f(x) = x⁵ + 2", options: ["5x⁴", "x⁴ + 2", "5x⁴ + 2", "x⁵"], correct: 0 },
        { f: "f(x) = 3x² + 2x", options: ["6x + 2x", "3x + 2", "6x + 2", "6x"], correct: 2 },
        { f: "f(x) = 8", options: ["8", "0", "1", "x"], correct: 1 },
        // Añadimos algunas más para mayor variedad
        { f: "f(x) = 7x² - 3", options: ["14x", "7x", "14x - 3", "7x²"], correct: 0 },
        { f: "f(x) = 9x", options: ["9", "x", "0", "9x"], correct: 0 },
        { f: "f(x) = x⁴", options: ["4x³", "x³", "4x⁴", "x⁵"], correct: 0 },
        { f: "f(x) = 2x + 1", options: ["2", "x", "1", "2x"], correct: 0 },
        { f: "f(x) = -6x³", options: ["-18x²", "-6x²", "18x²", "-18x"], correct: 0 },
    ];
    
    // Función para barajar las preguntas
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };


    // --- Elementos del DOM ---
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");
    const endScreen = document.getElementById("end-screen");

    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");

    const timerDisplay = document.getElementById("timer").querySelector("strong");
    const scoreDisplay = document.getElementById("score").querySelector("strong");
    const functionText = document.getElementById("function-text");
    const optionsContainer = document.getElementById("options-container");
    const feedback = document.getElementById("feedback");
    const finalScoreDisplay = document.getElementById("final-score");
    const finalMessageText = document.getElementById("final-message-text"); // Nuevo
    const encouragementText = document.getElementById("encouragement-text"); // Nuevo
    const confettiContainer = document.getElementById("confetti-container"); // Nuevo

    // --- Estado del Juego ---
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 50;
    let timerInterval = null;
    let displayedQuestions = []; // Para llevar un registro de las preguntas mostradas en esta ronda

    // --- Funciones del Juego ---

    function startGame() {
        // Reiniciar estado
        score = 0;
        timeLeft = 50;
        currentQuestionIndex = 0;
        displayedQuestions = [...questions]; // Copia el banco de preguntas
        shuffleArray(displayedQuestions); // Baraja las preguntas para la ronda actual

        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        feedback.textContent = ""; // Limpiar retroalimentación

        // Cambiar pantallas
        startScreen.classList.remove("active");
        endScreen.classList.remove("active");
        gameScreen.classList.add("active");

        // Iniciar juego
        showQuestion();
        startTimer();
    }

    function startTimer() {
        // Limpiar cualquier timer anterior
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 10) { // Color rojo para el tiempo bajo
                timerDisplay.style.color = '#F44336';
            } else {
                timerDisplay.style.color = '#FF5722';
            }


            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function showQuestion() {
        // Limpiar estado anterior
        optionsContainer.innerHTML = "";
        feedback.textContent = "";

        // Verificar si hay más preguntas disponibles en displayedQuestions
        if (currentQuestionIndex >= displayedQuestions.length) {
            // Si se acaban las preguntas, barajamos y reiniciamos el índice
            shuffleArray(displayedQuestions);
            currentQuestionIndex = 0;
        }

        // Cargar pregunta actual
        const q = displayedQuestions[currentQuestionIndex];
        functionText.textContent = q.f;

        // Crear botones de opción
        q.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.className = "option-btn";
            button.textContent = option;
            button.dataset.index = index; // Guardamos el índice para la corrección
            button.addEventListener("click", selectAnswer);
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(e) {
        // Deshabilitar todos los botones para evitar doble clic
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });

        const selectedIndex = parseInt(e.target.dataset.index);
        const correctIndex = displayedQuestions[currentQuestionIndex].correct;

        // --- Retroalimentación (Constructivismo) ---
        if (selectedIndex === correctIndex) {
            e.target.classList.add("correct");
            feedback.textContent = "¡Correcto! ✅";
            feedback.style.color = "#4CAF50";
            score++;
            scoreDisplay.textContent = score;
        } else {
            e.target.classList.add("incorrect");
            // Muestra cuál ERA la correcta
            optionsContainer.children[correctIndex].classList.add("correct");
            feedback.textContent = "¡Incorrecto! ❌";
            feedback.style.color = "#F44336";
        }

        // Pausa breve para que el estudiante vea la retroalimentación
        setTimeout(() => {
            currentQuestionIndex++;
            showQuestion();
        }, 1200); // 1.2 segundos de pausa
    }

    function endGame() {
        clearInterval(timerInterval);
        gameScreen.classList.remove("active");
        endScreen.classList.add("active");
        finalScoreDisplay.textContent = score;
        
        // --- Mensaje Final Dinámico ---
        let message = "";
        let emoji = "";
        let finalScoreColor = "";

        if (score >= 10) { // Excelente
            message = "¡Asombroso! Eres un genio de las derivadas. Sigue así. 🎉";
            emoji = "✨";
            finalScoreColor = "#4CAF50"; // Verde
            createConfetti(50); // Generar confeti si la puntuación es alta
        } else if (score >= 5) { // Bueno
            message = "¡Muy bien hecho! Estás en el camino correcto. ¡Practica más! 🌟";
            emoji = "👍";
            finalScoreColor = "#2196F3"; // Azul
        } else { // Necesita práctica
            message = "Buen intento. ¡No te desanimes! La práctica hace al maestro. 💪";
            emoji = "📚";
            finalScoreColor = "#F44336"; // Rojo
        }
        
        finalMessageText.textContent = `¡Tiempo! ${emoji}`;
        encouragementText.textContent = message;
        finalScoreDisplay.style.color = finalScoreColor;
    }

    // --- Función para generar confeti ---
    function createConfetti(amount) {
        const colors = ['#FFD700', '#2196F3', '#FF69B4', '#4CAF50']; // Oro, Azul, Rosa, Verde
        for (let i = 0; i < amount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.setProperty('--x', `${(Math.random() - 0.5) * 400}px`); // Caer de forma aleatoria
            confetti.style.setProperty('--y', `${(Math.random() * 200) + 300}px`);
            confetti.style.setProperty('--deg', `${Math.random() * 360}deg`);
            confetti.style.animationDelay = `${Math.random() * 0.5}s`; // Pequeño retraso para que caigan a destiempo
            confettiContainer.appendChild(confetti);

            // Eliminar el confeti después de su animación para no saturar el DOM
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }


    // --- Event Listeners ---
    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", () => {
        // Limpiar confeti existente antes de reiniciar
        confettiContainer.innerHTML = '';
        startGame();
    });
});