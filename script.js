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

    function removerRATO(index) {
    if (index >= buracos.length) return;
    buracos[index].classList.remove('rato');
    buracos[index].removeEventListener('click', lidarComCliqueRATO);
    removerRATO(index + 1);
}
//essa função percorre o Array buracos, removendo o rato de cada buraco e tirando o ouvinte de
//eventos de cada um, deixando todos os buracos vazios no começo do jogo


function aparecer(randomValue = Math.random()) {
    removerRATO(0);
    const aleatorio = buracos[Math.floor(randomValue * buracos.length)];
    aleatorio.classList.add('rato');
    aleatorio.addEventListener('click', lidarComCliqueRATO);
}
//Essa função,é responsável por fazer com que um rato apareça em um dos buracos
//a função irá usar Math.random() para gerar um número aleatório entre 0 e 1.
// Esse número é utilizado para determinar em qual buraco o rato irá aparecer.
function lidarComCliqueRATO() {
    if (!estadoDoJogo.jogoAcabado) {
        estadoDoJogo.pontuacao++;
        displayPontuacao.textContent = `Pontuação: ${estadoDoJogo.pontuacao}`;
    }
    const audio = document.getElementById('hit-sound');
    audio.currentTime = 0;
    audio.play();
    this.classList.remove('rato');
}
// essa função  verifica se o jogo ainda está ativo, incrementa a pontuação do jogador,
// atualiza a exibição da pontuação e remove o rato do buraco clicado. 

function iniciarJogo() {
    // Verifica se o jogo já está em andamento. Se sim, sai da função.
    if (!estadoDoJogo.jogoAcabado) {
        return; // Não inicia o jogo se já estiver em progresso
    }

    // Define a cor do elemento clicado para um tom de preto translúcido
    clicado.style.fill = "rgba(0, 0, 0, 0.371)";

    // Marca o jogo como iniciado (não está mais acabado) e zera a pontuação
    estadoDoJogo.jogoAcabado = false;
    estadoDoJogo.pontuacao = 0;
    
    // Atualiza a pontuação na tela
    displayPontuacao.textContent = `Pontuação: ${estadoDoJogo.pontuacao}`;
    
    // Reinicia o temporizador para 60 segundos e atualiza o display
    estadoDoJogo.timer = 60;
    estadoDoJogo.velocidaderato = 1000;
    displayTimer.textContent = `Tempo: ${estadoDoJogo.timer}s`;

    // Desabilita o botão de iniciar o jogo e habilita o botão de finalizar
    botaoIniciar.disabled = true;
    botaoFinalizar.disabled = false;

    // Inicia a contagem regressiva do temporizador, reduzindo o tempo a cada segundo (1000ms)
    estadoDoJogo.contagemRegressiva = setInterval(() => {
        // Diminui o temporizador a cada segundo
        estadoDoJogo.timer--;
        displayTimer.textContent = `Tempo: ${estadoDoJogo.timer}s`; // Atualiza o display do tempo

        // Se o tempo acabar (timer <= 0), termina o jogo
        if (estadoDoJogo.timer <= 0) {
            // Para o temporizador e o intervalo de aparecimento de moles
            clearInterval(estadoDoJogo.contagemRegressiva);
            clearInterval(estadoDoJogo.intervalorato); // Para o intervalo da função de moles
            estadoDoJogo.jogoAcabado = true; // Marca o jogo como terminado

            // Exibe um alerta com a pontuação final do jogador
            alert(`Fim de Jogo!\nSua pontuação final: ${estadoDoJogo.pontuacao}`);

            // Reativa o botão de iniciar e desativa o botão de finalizar
            botaoIniciar.disabled = false;
            botaoFinalizar.disabled = true;
        }
    }, 1000); // Executa a cada 1000ms (1 segundo)

    // Inicia o intervalo para os moles aparecerem periodicamente com base na velocidade definida (velocidaderato)
    estadoDoJogo.intervalorato = setInterval(() => {
        // Se o jogo ainda não terminou, chama a função 'aparecer' para mostrar o rato
        if (!estadoDoJogo.jogoAcabado) {
            aparecer();

            // Verifica se o tempo restante é um múltiplo de 40 e a velocidade pode ser reduzida
            // A cada 40 segundos (ou múltiplo de 40), aumenta a velocidade dos moles (reduz o intervalo)
            if (estadoDoJogo.timer % 40 === 0 && estadoDoJogo.velocidaderato > 200) {
                clearInterval(estadoDoJogo.intervalorato); // Para o intervalo atual

                // Reduz a velocidade dos moles (ou seja, eles aparecem mais rápido)
                estadoDoJogo.velocidaderato -= 500;

                // Cria um novo intervalo com a nova velocidade (menor intervalo)
                estadoDoJogo.intervalorato = setInterval(() => {
                    if (!estadoDoJogo.jogoAcabado) {
                        aparecer();
                    }
                }, estadoDoJogo.velocidaderato);
            }
        }
    }, estadoDoJogo.velocidaderato); // Executa com base na velocidade inicial definida (estadoDoJogo.velocidaderato)

    console.log("Jogo iniciado"); // Mensagem de log no console para indicar que o jogo começou
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
//função que finaliza o jogo, trazendo as informações de pontuação finais e habilita para ser jogado novamente

    botaoIniciar.addEventListener("click", iniciarJogo);
    botaoFinalizar.addEventListener("click", finalizarJogo);
});
