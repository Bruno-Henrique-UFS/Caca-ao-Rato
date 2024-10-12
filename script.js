document.addEventListener("DOMContentLoaded", function () {
    const score = document.getElementById("score-value")
    const time = document.getElementById("time")
    const clicked = document.querySelector('.clicked')
    const holes = document.querySelectorAll(".hole");
    const startButton = document.getElementById("startButton");
    const endButton = document.getElementById("endButton");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");

    
    const gameState = {
        timer: 60,
        score: 0,
        gameOver: true,
        moleSpeed: 1000, 
        countdown: null,
        moleInterval: null,
    };

   

    function comeout() {
        holes.forEach(hole => {
            hole.classList.remove('mole');
            hole.removeEventListener('click', handleMoleClick);
        });

        const random = holes[Math.floor(Math.random() * holes.length)];

        random.classList.add('mole');
        random.addEventListener('click', handleMoleClick);
    }

    function handleMoleClick() {
        if (!gameState.gameOver) {
            gameState.score++;
            scoreDisplay.textContent = `Score: ${gameState.score}`;
        }
        this.classList.remove('mole');
    }

    function startGame() {
        if (!gameState.gameOver) {
            return; // Não inicia o jogo se já estiver em progresso
        }

        clicked.style.fill = "rgba(0, 0, 0, 0.371)";
 

        gameState.gameOver = false;
        gameState.score = 0;
        scoreDisplay.textContent = `Score: ${gameState.score}`;
        gameState.timer = 60;
        timerDisplay.textContent = `Time: ${gameState.timer}s`;

        
        startButton.disabled = true;
        endButton.disabled = false;

        
        gameState.countdown = setInterval(() => {
            gameState.timer--;
            timerDisplay.textContent = `Time: ${gameState.timer}s`;


            if (gameState.timer <= 0) {
                clearInterval(gameState.countdown);
                clearInterval(gameState.moleInterval); // Para o intervalo da mole
                gameState.gameOver = true;
                alert(`Game Over!\nYour final score: ${gameState.score}`);
                startButton.disabled = false;
                endButton.disabled = true;
            }
        }, 1000);

        gameState.moleInterval = setInterval(() => {
            if (!gameState.gameOver) {
                comeout();
                // Aumenta a velocidade a cada 10 segundos
                if (gameState.timer % 40 === 0 && gameState.moleSpeed > 200) {
                    clearInterval(gameState.moleInterval);
                    gameState.moleSpeed -= 500; // Diminui a velocidade (aumenta a frequência)
                    gameState.moleInterval = setInterval(() => {
                        if (!gameState.gameOver) comeout();
                    }, gameState.moleSpeed);
                }
            }
        }, gameState.moleSpeed);

        console.log("Game started");
    }

    function endGame() {
        clearInterval(gameState.countdown);
        clearInterval(gameState.moleInterval);
        gameState.gameOver = true;
        alert(`Game Ended!\nYour final score: ${gameState.score}`);
        gameState.score = 0;
        gameState.timer = 60;
        scoreDisplay.textContent = `Score: ${gameState.score}`;
        timerDisplay.textContent = `Time: ${gameState.timer}s`;
        startButton.disabled = false;
        endButton.disabled = true;
        clicked.style.fill = "black";
    }

    startButton.addEventListener("click", startGame);
    endButton.addEventListener("click", endGame);
});
