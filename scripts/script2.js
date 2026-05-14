const fases = {
  1: { colunas: 3, linhas: 3, inicio: 4, alvo: 8, obstaculos: [] },
  2: { colunas: 3, linhas: 3, inicio: 0, alvo: 2, obstaculos: [] },
  3: { colunas: 3, linhas: 3, inicio: 6, alvo: 0, obstaculos: [] },
  4: { colunas: 4, linhas: 4, inicio: 5, alvo: 10, obstaculos: [6] },
  5: { colunas: 4, linhas: 4, inicio: 0, alvo: 15, obstaculos: [5, 6] },
  6: { colunas: 4, linhas: 4, inicio: 3, alvo: 12, obstaculos: [6, 9] },
  7: { colunas: 5, linhas: 5, inicio: 12, alvo: 0, obstaculos: [7, 11, 13] },
  8: { colunas: 5, linhas: 5, inicio: 4, alvo: 20, obstaculos: [8, 9, 14] },
  9: { colunas: 5, linhas: 5, inicio: 6, alvo: 18, obstaculos: [7, 8, 13, 14] },
  10: { colunas: 6, linhas: 6, inicio: 0, alvo: 35, obstaculos: [1, 2, 3, 4, 10, 16, 22, 28] }
};

let faseAtual = 1;
let comandos = [];
let pos = 4;
let executando = false;

window.onload = () => carregarFase(faseAtual);

function tocarSom(nome) {
  const audio = new Audio(`audios/${nome.toLowerCase()}.mp3`);
  audio.play().catch(e => console.log("Som não achado: " + nome));
}

function carregarFase(id) {
  const config = fases[id];
  if (!config) return;

  faseAtual = id;
  pos = config.inicio;
  comandos = [];
  executando = false;
  atualizarSequencia();
  document.getElementById("feedback").innerText = "";
  document.getElementById("modal-parabens").style.display = "none";

  const grid = document.querySelector(".grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${config.colunas}, 80px)`;
  grid.style.gridTemplateRows = `repeat(${config.linhas}, 80px)`;

  for (let i = 0; i < config.colunas * config.linhas; i++) {
    const div = document.createElement("div");
    if (i === config.alvo) { div.classList.add("alvo"); div.innerText = "⭐"; }
    if (config.obstaculos.includes(i)) { div.classList.add("obstaculo"); div.innerText = "🚧"; }
    grid.appendChild(div);
  }

  const robo = document.createElement("div");
  robo.id = "robo";
  robo.innerText = "🤖";
  grid.appendChild(robo);
  atualizarPosicaoRobo(true);
}

function atualizarPosicaoRobo(imediato = false) {
  const config = fases[faseAtual];
  const robo = document.getElementById("robo");
  if (!robo) return;
  const x = (pos % config.colunas) * 90;
  const y = Math.floor(pos / config.colunas) * 90;
  if (imediato) robo.style.transition = "none";
  robo.style.left = x + "px";
  robo.style.top = y + "px";
  if (imediato) setTimeout(() => robo.style.transition = "all 0.4s ease-in-out", 50);
}

function addComando(cmd) {
  if (executando) return;
  comandos.push(cmd);
  atualizarSequencia();
}

function atualizarSequencia() {
  document.getElementById("sequencia").innerText = comandos.join(" → ");
}

function executar() {
  if (executando || comandos.length === 0) return;
  executando = true;
  
  let i = 0;
  const intervalo = setInterval(() => {
    if (i >= comandos.length || !executando) {
      clearInterval(intervalo);
      executando = false;
      return;
    }
    const cmd = comandos[i];
    tocarSom(cmd); // Grita "cima", "baixo"...
    mover(cmd);
    i++;
  }, 1000);
}

function registrarEvento(tipo, fase, status, detalhe) {
  const dados = JSON.parse(localStorage.getItem('autismath_stats') || '[]');
  dados.push({ tipo, fase, status, detalhe, data: new Date().toLocaleString() });
  localStorage.setItem('autismath_stats', JSON.stringify(dados));
}

function mover(cmd) {
  const config = fases[faseAtual];
  let novaPos = pos;
  let bateu = false;

  if (cmd === "direita") {
    if (pos % config.colunas !== config.colunas - 1) novaPos = pos + 1;
    else bateu = true;
  } else if (cmd === "esquerda") {
    if (pos % config.colunas !== 0) novaPos = pos - 1;
    else bateu = true;
  } else if (cmd === "baixo") {
    if (pos + config.colunas < config.colunas * config.linhas) novaPos = pos + config.colunas;
    else bateu = true;
  } else if (cmd === "cima") {
    if (pos - config.colunas >= 0) novaPos = pos - config.colunas;
    else bateu = true;
  }

  const robo = document.getElementById("robo");

  if (bateu || config.obstaculos.includes(novaPos)) {
    // ERRO - TREMER E RESETAR (ABA)
    executando = false;
    robo.classList.add("tremer");
    tocarSom("erro"); // Som de batida
    registrarEvento('Lógica', faseAtual, 'Erro', bateu ? 'Parede' : 'Obstáculo');
    
    setTimeout(() => {
      robo.classList.remove("tremer");
      tocarSom("tente_novamente");
      limpar(); // Reseta tudo
    }, 500);
    return;
  }

  pos = novaPos;
  atualizarPosicaoRobo();
  robo.classList.remove("animar-pulo");
  void robo.offsetWidth;
  robo.classList.add("animar-pulo");

  if (pos === config.alvo) {
    executando = false;
    registrarEvento('Lógica', faseAtual, 'Acerto', 'Estrela');
    mostrarVitoria();
  }
}

function mostrarVitoria() {
  tocarSom("parabens");
  document.getElementById("modal-parabens").style.display = "block";
  
  // Balões da vitória
  for (let i = 0; i < 15; i++) {
    setTimeout(criarBalao, i * 300);
  }

  if (!fases[faseAtual + 1]) {
    // FINAL DE TUDO
    setTimeout(() => {
      document.querySelector("#modal-parabens h2").innerText = "🏆 CAMPEÃO! 🏆";
      tocarSom("vitoria_final");
    }, 2000);
  }
}

function criarBalao() {
  const balao = document.createElement("div");
  balao.className = "balao";
  balao.style.left = Math.random() * 90 + "vw";
  balao.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
  
  balao.onclick = () => estourar(balao);
  
  // Estouro automático em 7 segundos
  setTimeout(() => {
    if (balao.parentElement) estourar(balao);
  }, 7000);

  document.body.appendChild(balao);
}

function estourar(balao) {
  balao.classList.add("estouro");
  tocarSom("estouro");
  setTimeout(() => balao.remove(), 200);
}

function limpar() {
  carregarFase(faseAtual);
}

function proximaFase() {
  if (fases[faseAtual + 1]) {
    carregarFase(faseAtual + 1);
  } else {
    window.location.href = 'resul.html';
  }
}