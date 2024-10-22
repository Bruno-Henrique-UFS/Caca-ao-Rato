/*NOTA: Tentamos ao máximo colocar todo o código de acordo com o paradigma funcional, porém devido a grande manipulação do DOM
do codigo e alterações que devem ocorrer durando o jogo alguns aspectos não puderam ser totalmente adaptados.

Código Base:
         - https://www.geeksforgeeks.org/whack-a-mole-game-using-html-css-and-javascript/
*/

document.addEventListener("DOMContentLoaded", function () {
    // Captura elementos do DOM como o display de pontuação, tempo, buracos, botões, modal e som.
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

    // Função que cria um gerenciador de estado para o jogo
    const criarGerenciadorDeEstado = () => {
        // Define o estado inicial com timer, pontuação, status do jogo e outras variáveis.
        const estadoInicial = {
            timer: 60,
            pontuacao: 0,
            jogoAcabado: true,
            velocidaderato: 1000, // Velocidade inicial do rato (em milissegundos).
            contagemRegressiva: null,
            intervalorato: null,
        };

        // Função para retornar o estado atual.
        const getEstado = () => ({ ...estadoInicial });

        // Função para atualizar o estado
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

    // Inicializa o gerenciador de estado.
    const { atualizarEstado, getEstado } = criarGerenciadorDeEstado();

    /*essa maneira de manipular o estado do jogo foi a que encontramos e acreditamos chegar mais perto do paradigma funcional, uma vez
    que sempre cria um novo registro como copia do anterior com as alterações necessarias */

    // Remove o rato de um buraco.
    const removerRATO = (buracos, index = 0) => {
        if (index >= buracos.length) return;
        buracos[index].classList.remove('rato'); // Remove a classe 'rato' do buraco.
        buracos[index].removeEventListener('click', lidarComCliqueRATO); // Remove o evento de clique.
        removerRATO(buracos, index + 1);
    };

    // Seleciona um buraco aleatório.
    const selecionarBuraco = (buracos, randomvalue = Math.random()) => {
        return buracos[Math.floor(randomvalue * buracos.length)];
    };

    // Coloca o rato no buraco selecionado.
    const colocandoRato = (buraco) => {
        buraco.classList.add('rato'); // Adiciona a classe 'rato' ao buraco.
        buraco.addEventListener('click', lidarComCliqueRATO); // Adiciona o evento de clique.
    };

    // Aparece um rato em um buraco aleatório e remove o rato anterior.
    const aparecerRato = (buracos, randomvalue = Math.random()) => {
        removerRATO(buracos); // Remove o rato anterior.
        const buracoaleatorio = selecionarBuraco(buracos, randomvalue); // Seleciona um novo buraco.
        colocandoRato(buracoaleatorio); // Coloca o rato no novo buraco.
    };

    // Função para tocar som ao acertar o rato.
    const som = (audio) => {
        audio.currentTime = 0; // Reseta o som para o início.
        audio.play(); // Toca o som.
    };

    // Lida com o clique no rato, atualizando a pontuação.
    const lidarComCliqueRATO = (e) => {
        const estadoAtual = getEstado();
        if (!estadoAtual.jogoAcabado && e.target.classList.contains('rato')) {
            som(audio); // Toca o som de hit.
            e.target.classList.remove('rato'); // Remove o rato após o clique.
            const novoEstado = atualizarEstado({ pontuacao: estadoAtual.pontuacao + 1 });
            displayPontuacao.textContent = `Pontuação: ${novoEstado.pontuacao}`; // Atualiza a pontuação no display.
        }
    };
    /*foi necessário o uso de e.target.classList.contains('rato') para verificar se o rato realmente esta no buraco,
    e so se estiver executar a função*/

    // Inicia a contagem regressiva do jogo.
    const iniciarContagemRegressiva = () => {
        const contagem = setInterval(() => {
            const estadoAtual = getEstado();
            const novoEstado = atualizarEstado({ timer: estadoAtual.timer - 1 });
            displayTimer.textContent = `Tempo: ${novoEstado.timer}s`; // Atualiza o display do tempo.
            if (novoEstado.timer <= 0) {
                clearInterval(novoEstado.contagemRegressiva); // Para a contagem regressiva.
                clearInterval(novoEstado.intervalorato); // Para a aparição dos ratos.
                finalizarJogo(novoEstado); // Finaliza o jogo.
            }
        }, 1000);
        atualizarEstado({ contagemRegressiva: contagem });
    };
    /*O uso do setInterval foi necessário pois uma função recursiva não conseguia incluir todas as demais mudanças necessarias que ocorrem junto com isso,
    como as alterações no DOM e no gerenciamento do jogo, e ela ainda permite um maior controle e previsibilidade nessa parte do código*/

    // Inicia o intervalo em que os ratos aparecem.
    const iniciarIntervaloRato = () => {
        const intervalo = setInterval(() => {
            const estadoAtual = getEstado();
            if (!estadoAtual.jogoAcabado) {
                aparecerRato(buracos);
                // Aumenta a velocidade dos ratos a cada 10 segundos.
                if (estadoAtual.timer % 10 === 0 && estadoAtual.velocidaderato > 300) {
                    clearInterval(estadoAtual.intervalorato);
                    const novoEstado = atualizarEstado({ velocidaderato: estadoAtual.velocidaderato - 100 });
                    iniciarIntervaloRato();
                }
            }
        }, getEstado().velocidaderato);
        atualizarEstado({ intervalorato: intervalo });
    };
    /*novamente o uso de setInterval foi uma escolha melhor, pois não gera problemas ou acumulos no funcionamento
    */

    // Função para iniciar o jogo.
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
        iniciarContagemRegressiva(); // Inicia a contagem regressiva.
        iniciarIntervaloRato(); // Inicia a aparição dos ratos.
        displayPontuacao.textContent = `Pontuação: ${novoEstado.pontuacao}`;
        displayTimer.textContent = `Tempo: ${novoEstado.timer}s`;
        botaoIniciar.disabled = true; // Desabilita o botão "Iniciar" enquanto o jogo está em andamento.
        botaoFinalizar.disabled = false; // Habilita o botão "Finalizar".
    };

    // Finaliza o jogo, limpando intervalos e resetando o estado.
    const finalizarJogo = (estadoAtual) => {
        clearInterval(estadoAtual.contagemRegressiva);
        clearInterval(estadoAtual.intervalorato);
        alert(`Fim de Jogo!\nSua pontuação final: ${estadoAtual.pontuacao}`); // Exibe uma mensagem de fim de jogo.
        const novoEstado = atualizarEstado({
            jogoAcabado: true,
            pontuacao: 0,
            timer: 60,
            velocidaderato: 1000
        });
        displayPontuacao.textContent = `Pontuação: ${novoEstado.pontuacao}`;
        displayTimer.textContent = `Tempo: ${novoEstado.timer}s`;
        botaoIniciar.disabled = false; // Habilita o botão "Iniciar" novamente.
        botaoFinalizar.disabled = true; // Desabilita o botão "Finalizar".
        clicado.style.fill = "black";
        removerRATO(buracos); // Remove qualquer rato restante dos buracos.
    };

    // Inicializa o modal de instruções.
    const inicializarModal = () => {
        btn.onclick = () => modal.style.display = "block";
        span.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target === modal) modal.style.display = "none";
        };
    };

    inicializarModal();
    botaoIniciar.addEventListener("click", iniciarJogo); // Adiciona evento de clique ao botão "Iniciar".
    botaoFinalizar.addEventListener("click", () => finalizarJogo(getEstado())); // Adiciona evento de clique ao botão "Finalizar".
});
