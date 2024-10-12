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

    

    botaoIniciar.addEventListener("click", iniciarJogo);
    botaoFinalizar.addEventListener("click", finalizarJogo);
});
