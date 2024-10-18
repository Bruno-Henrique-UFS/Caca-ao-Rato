document.addEventListener("DOMContentLoaded", function () {
    const pontuacao = document.getElementById("score-value");
    const tempo = document.getElementById("time");
    const clicado = document.querySelector('.clicked');
    const buracos = document.querySelectorAll(".hole");
    const botaoIniciar = document.getElementById("startButton");
    const botaoFinalizar = document.getElementById("endButton");
    const displayPontuacao = document.getElementById("Pontuação");
    const displayTimer = document.getElementById("timer");
    const modal = document.getElementById("myModal");
    const btn = document.querySelector(".instru");
    const span = document.getElementsByClassName("close")[0];
    const audio = document.getElementById('hit-sound');

    const criarGerenciadorDeEstado = () => {
        const estadoInicial = {
            timer: 60,
            pontuacao: 0,
            jogoAcabado: true,
            velocidaderato: 1000,
            contagemRegressiva: null,
            intervalorato: null,
        };

        const getEstado = () => ({ ...estadoInicial });

        const atualizarEstado = (alteracoes) => {
            const estadoAtualizado = { ...estadoInicial, ...alteracoes };
            estadoInicial.timer = estadoAtualizado.timer;
            estadoInicial.pontuacao = estadoAtualizado.pontuacao;
            estadoInicial.jogoAcabado = estadoAtualizado.jogoAcabado;
            estadoInicial.velocidaderato = estadoAtualizado.velocidaderato;
            estadoInicial.contagemRegressiva = estadoAtualizado.contagemRegressiva;
            estadoInicial.intervalorato = estadoAtualizado.intervalorato;
            return estadoAtualizado;
        };

        return { atualizarEstado, getEstado };
    };

    const { atualizarEstado, getEstado } = criarGerenciadorDeEstado();

    const removerRATO = (buracos, index = 0) => {
        if (index >= buracos.length) return;
        buracos[index].classList.remove('rato');
        buracos[index].removeEventListener('click', lidarComCliqueRATO);
        removerRATO(buracos, index + 1);
    };

    const aparecer = (buracos, randomValue = Math.random()) => {
        removerRATO(buracos);
        const aleatorio = buracos[Math.floor(randomValue * buracos.length)];
        aleatorio.classList.add('rato');
        aleatorio.addEventListener('click', lidarComCliqueRATO, { once: true });
    };

    const som = (audio) => {
        audio.currentTime = 0;
        audio.play();
    };

    const lidarComCliqueRATO = (e) => {
        const estadoAtual = getEstado();
        if (!estadoAtual.jogoAcabado && e.target.classList.contains('rato')) {
            som(audio);
            e.target.classList.remove('rato');
            const novoEstado = atualizarEstado({ pontuacao: estadoAtual.pontuacao + 1 });
            displayPontuacao.textContent = `Pontuação: ${novoEstado.pontuacao}`;
        }
    };

    const iniciarContagemRegressiva = () => {
        const contagem = setInterval(() => {
            const estadoAtual = getEstado();
            const novoEstado = atualizarEstado({ timer: estadoAtual.timer - 1 });
            displayTimer.textContent = `Tempo: ${novoEstado.timer}s`;
            if (novoEstado.timer <= 0) {
                clearInterval(novoEstado.contagemRegressiva);
                clearInterval(novoEstado.intervalorato);
                finalizarJogo(novoEstado);
            }
        }, 1000);
        atualizarEstado({ contagemRegressiva: contagem });
    };

    const iniciarIntervaloRato = () => {
        const intervalo = setInterval(() => {
            const estadoAtual = getEstado();
            if (!estadoAtual.jogoAcabado) {
                aparecer(buracos);
                if (estadoAtual.timer % 10 === 0 && estadoAtual.velocidaderato > 300) {
                    clearInterval(estadoAtual.intervalorato);
                    const novoEstado = atualizarEstado({ velocidaderato: estadoAtual.velocidaderato - 100 });
                    iniciarIntervaloRato();
                }
            }
        }, getEstado().velocidaderato);
        atualizarEstado({ intervalorato: intervalo });
    };

    const iniciarJogo = () => {
        const estadoAtual = getEstado();
        if (!estadoAtual.jogoAcabado) return;
        clicado.style.fill = "rgba(0, 0, 0, 0.371)";
        const novoEstado = atualizarEstado({
            jogoAcabado: false,
            pontuacao: 0,
            timer: 60,
            velocidaderato: 1000
        });
        iniciarContagemRegressiva();
        iniciarIntervaloRato();
        displayPontuacao.textContent = `Pontuação: ${novoEstado.pontuacao}`;
        displayTimer.textContent = `Tempo: ${novoEstado.timer}s`;
        botaoIniciar.disabled = true;
        botaoFinalizar.disabled = false;
    };

    const finalizarJogo = (estadoAtual) => {
        clearInterval(estadoAtual.contagemRegressiva);
        clearInterval(estadoAtual.intervalorato);
        alert(`Fim de Jogo!\nSua pontuação final: ${estadoAtual.pontuacao}`);
        const novoEstado = atualizarEstado({
            jogoAcabado: true,
            pontuacao: 0,
            timer: 60,
            velocidaderato: 1000
        });
        displayPontuacao.textContent = `Pontuação: ${novoEstado.pontuacao}`;
        displayTimer.textContent = `Tempo: ${novoEstado.timer}s`;
        botaoIniciar.disabled = false;
        botaoFinalizar.disabled = true;
        clicado.style.fill = "black";
    };

    const inicializarModal = () => {
        btn.onclick = () => modal.style.display = "block";
        span.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target === modal) modal.style.display = "none";
        };
    };

    inicializarModal();
    botaoIniciar.addEventListener("click", iniciarJogo);
    botaoFinalizar.addEventListener("click", () => finalizarJogo(getEstado()));
});
