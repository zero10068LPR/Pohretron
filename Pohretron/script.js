// --- CONFIGURAÇÕES ---
const ATALHO = "p"; // Você pode trocar para "F7" se preferir
const MINUTOS = 20;  // Tempo para o disparo

// LISTAS PARA SORTEIO
const fotos = ["LPR simbolo.png"];

// Áudios com sistema de raridade (Peso alto = comum / Peso baixo = raro)
const falasComPeso = [
    { arquivo: "Falas e sons/Pohretron 1.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 10.MP3", peso: 0.5 },
    { arquivo: "Falas e sons/Pohretron 2.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 3.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 4.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 5.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 6.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 7.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 8 .MP3", peso: 0.1 },
    { arquivo: "Falas e sons/Pohretron 9.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 11.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 12.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 13.MP3", peso: 5 },
    { arquivo: "Falas e sons/Pohretron 14.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 15.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 16.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 17.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 18.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 19.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 20.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 21.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 22.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 23.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 24.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 25.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 26.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 27.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 28.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 29.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 30.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 31.MP3", peso: 5 },
    { arquivo: "Falas e sons/Pohretron 32.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 33.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 34.MP3", peso: 10 },
    { arquivo: "Falas e sons/Pohretron 35.MP3", peso: 4 },
];

// SONS FIXOS
const somInicio = "grito.mp4"; // <-- COLOQUE AQUI O SEU ÁUDIO RÁPIDO DE INÍCIO
const somEntrada = "Falas e sons/Esporrada real.mp4"; 
const somSaida = "Ragdoll.MP3"; // Som de colisão do GMod

let timerAtivo = false;
let tempoDecorrido = 0;
const tempoFinal = MINUTOS * 60;
let intervalo;

// MEMÓRIA DO SCRIPT - Salva os últimos áudios jogados para evitar repetição
let historicoFalas = [];

function sortearFala() {
    let falasDisponiveis = falasComPeso.filter(item => !historicoFalas.includes(item.arquivo));

    if (falasDisponiveis.length === 0) falasDisponiveis = falasComPeso;

    let totalPeso = falasDisponiveis.reduce((soma, item) => soma + item.peso, 0);
    let sorteio = Math.random() * totalPeso;
    let somaAcumulada = 0;

    for (let item of falasDisponiveis) {
        somaAcumulada += item.peso;
        if (sorteio <= somaAcumulada) {
            historicoFalas.push(item.arquivo);
            
            if (historicoFalas.length > 5) {
                historicoFalas.shift();
            }
            return item.arquivo;
        }
    }
}

function toggleTimer() {
    if (!timerAtivo) {
        timerAtivo = true;
        
        const player = document.getElementById('som-entrada');

        // 1. APENAS TOCA O ÁUDIO DE CONFIRMAÇÃO (SEM ALTERAR NADA VISUAL)
        player.src = somInicio;
        player.play();

        console.log("Pohretron Ativado! Tocando áudio de confirmação em segundo plano...");

        // 2. O TIMER SÓ COMEÇA QUANDO O ÁUDIO DE INÍCIO TERMINAR
        player.onended = () => {
            player.onended = null; // Limpa o evento para não dar conflito

            tempoDecorrido = 0;
            console.log("Áudio de início finalizado. Timer de " + MINUTOS + " minutos iniciado!");

            intervalo = setInterval(() => {
                tempoDecorrido++;
                if (tempoDecorrido >= tempoFinal) {
                    clearInterval(intervalo);
                    dispararPohretron();
                }
            }, 1000);
        };
    }
}

function dispararPohretron() {
    const imagem = document.getElementById('pohretron-img');
    const player = document.getElementById('som-entrada');

    imagem.src = fotos[Math.floor(Math.random() * fotos.length)];
    player.src = somEntrada;
    imagem.style.display = "block"; 
    imagem.classList.remove('efeito-colisao');
    player.play();

    player.onended = () => {
        player.src = sortearFala();
        player.play();
        player.onended = () => {
            player.src = somSaida;
            imagem.classList.add('efeito-colisao'); // Ativa o tremor do GMod
            player.play();
            player.onended = () => {
                imagem.style.display = "none";
                imagem.classList.remove('efeito-colisao');
                player.onended = null;
                timerAtivo = false;
            };
        };
    };
}

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === ATALHO.toLowerCase()) toggleTimer();
});