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

    function removerRatos(index) {
    if (index >= buracos.length) return;
    buracos[index].classList.remove('rato');
    buracos[index].removeEventListener('click', lidarComCliqueRato);
    removerRatos(index + 1);
}
//essa função percorre o Array buracos, removendo o rato de cada buraco e tirando o ouvinte de
//eventos de cada um, deixando todos os buracos vazios no começo do jogo







    
function FinalizarJogo() {
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
