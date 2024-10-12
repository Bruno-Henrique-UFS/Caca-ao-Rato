document.addEventListener("DOMContentLoaded", function () {
    const pontuacao = document.getElementById("score-value");
    const tempo = document.getElementById("time");
    const clicado = document.querySelector('.clicked');
    const buracos = document.querySelectorAll(".hole");
    const botaoIniciar = document.getElementById("startButton");
    const botaoFinalizar = document.getElementById("endButton");
    const displayPontuacao = document.getElementById("Pontuação");
    const displayTimer = document.getElementById("timer");

    const estadoDoJogo = {
        timer: 60,
        pontuacao: 0,
        jogoAcabado: true,
        velocidaderato: 1000,
        contagemRegressiva: null,
        intervalorato: null,
    };

    function removerMoles(index) {
        if (index >= buracos.length) return;
        buracos[index].classList.remove('rato');
        buracos[index].removeEventListener('click', lidarComCliqueMole);
        removerMoles(index + 1);
    }
    
    function aparecer(randomValue = Math.random()) {
        removerMoles(0);
        const aleatorio = buracos[Math.floor(randomValue * buracos.length)];
        aleatorio.classList.add('rato');
        aleatorio.addEventListener('click', lidarComCliqueMole);
    }
    
    function lidarComCliqueMole() {
        if (!estadoDoJogo.jogoAcabado) {
            estadoDoJogo.pontuacao++;
            displayPontuacao.textContent = `Pontuação: ${estadoDoJogo.pontuacao}`;
        }
        this.classList.remove('rato');
    }

    function iniciarJogo() {
        if (!estadoDoJogo.jogoAcabado) {
            return; // Não inicia o jogo se já estiver em progresso
        }

        clicado.style.fill = "rgba(0, 0, 0, 0.371)";

        estadoDoJogo.jogoAcabado = false;
        estadoDoJogo.pontuacao = 0;
        displayPontuacao.textContent = `Pontuação ${estadoDoJogo.pontuacao}`;
        estadoDoJogo.timer = 60;
        displayTimer.textContent = `Tempo: ${estadoDoJogo.timer}s`;

        botaoIniciar.disabled = true;
        botaoFinalizar.disabled = false;

        estadoDoJogo.contagemRegressiva = setInterval(() => {
            estadoDoJogo.timer--;
            displayTimer.textContent = `Tempo: ${estadoDoJogo.timer}s`;

            if (estadoDoJogo.timer <= 0) {
                clearInterval(estadoDoJogo.contagemRegressiva);
                clearInterval(estadoDoJogo.intervalorato); // Para o intervalo da mole
                estadoDoJogo.jogoAcabado = true;
                alert(`Fim de Jogo!\nSua pontuação final: ${estadoDoJogo.pontuacao}`);
                botaoIniciar.disabled = false;
                botaoFinalizar.disabled = true;
            }
        }, 1000);

        estadoDoJogo.intervalorato = setInterval(() => {
            if (!estadoDoJogo.jogoAcabado) {
                aparecer();
                // Aumenta a velocidade a cada 10 segundos
                if (estadoDoJogo.timer % 40 === 0 && estadoDoJogo.velocidaderato > 200) {
                    clearInterval(estadoDoJogo.intervalorato);
                    estadoDoJogo.velocidaderato -= 500; // Diminui a velocidade (aumenta a frequência)
                    estadoDoJogo.intervalorato = setInterval(() => {
                        if (!estadoDoJogo.jogoAcabado) aparecer();
                    }, estadoDoJogo.velocidaderato);
                }
            }
        }, estadoDoJogo.velocidaderato);

        console.log("Jogo iniciado");
    }

    function finalizarJogo() {
        clearInterval(estadoDoJogo.contagemRegressiva);
        clearInterval(estadoDoJogo.intervalorato);
        estadoDoJogo.jogoAcabado = true;
        alert(`Jogo Finalizado!\nSua pontuação final: ${estadoDoJogo.pontuacao}`);
        estadoDoJogo.pontuacao = 0;
        estadoDoJogo.timer = 60;
        displayPontuacao.textContent = `Pontuação: ${estadoDoJogo.pontuacao}`;
        displayTimer.textContent = `Tempo: ${estadoDoJogo.timer}s`;
        botaoIniciar.disabled = false;
        botaoFinalizar.disabled = true;
        clicado.style.fill = "black";
    }

    botaoIniciar.addEventListener("click", iniciarJogo);
    botaoFinalizar.addEventListener("click", finalizarJogo);
});
