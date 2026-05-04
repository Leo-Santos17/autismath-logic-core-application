const fases = {
  1: {
    colunas: 3,
    linhas: 3,
    inicio: 4,
    alvo: 8,
    obstaculos: []
  },
  2: {
    colunas: 2,
    linhas: 4,
    inicio: 2,
    alvo: 1,
    obstaculos: [4, 7]
  }
};

let faseAtual = 1;
let comandos = [];
let pos = 4;

// Inicializar
window.onload = () => carregarFase(faseAtual);

function carregarFase(id) {
  const config = fases[id];
  if (!config) return;

  faseAtual = id;
  pos = config.inicio;
  comandos = [];
  atualizarSequencia();
  document.getElementById("feedback").innerText = "";

  const grid = document.querySelector(".grid");
  grid.innerHTML = "";

  // Ajustar grid CSS
  grid.style.gridTemplateColumns = `repeat(${config.colunas}, 80px)`;
  grid.style.gridTemplateRows = `repeat(${config.linhas}, 80px)`;

  // Criar células
  const totalCelulas = config.colunas * config.linhas;
  for (let i = 0; i < totalCelulas; i++) {
    const div = document.createElement("div");
    if (i === config.alvo) {
      div.classList.add("alvo");
      div.innerText = "⭐";
    }
    if (config.obstaculos.includes(i)) {
      div.classList.add("obstaculo");
      div.innerText = "🚧";
    }
    grid.appendChild(div);
  }

  // Criar Robô
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

  if (imediato) {
    setTimeout(() => {
      robo.style.transition = "all 0.4s ease-in-out";
    }, 50);
  }
}

function addComando(cmd) {
  comandos.push(cmd);
  atualizarSequencia();
}

function atualizarSequencia() {
  document.getElementById("sequencia").innerText = comandos.join(" → ");
}

function executar() {
  comandos.forEach((cmd, i) => {
    setTimeout(() => {
      mover(cmd);
    }, i * 500);
  });
}

function mover(cmd) {
  const config = fases[faseAtual];
  let novaPos = pos;

  if (cmd === "direita" && pos % config.colunas !== config.colunas - 1) {
    novaPos = pos + 1;
  }
  if (cmd === "esquerda" && pos % config.colunas !== 0) {
    novaPos = pos - 1;
  }
  if (cmd === "baixo" && pos + config.colunas < config.colunas * config.linhas) {
    novaPos = pos + config.colunas;
  }
  if (cmd === "cima" && pos - config.colunas >= 0) {
    novaPos = pos - config.colunas;
  }

  // Bloquear se for obstáculo
  if (config.obstaculos.includes(novaPos)) return;

  if (novaPos === pos) return;

  pos = novaPos;
  atualizarPosicaoRobo();

  // Efeito de pulo
  const robo = document.getElementById("robo");
  robo.classList.remove("animar-pulo");
  void robo.offsetWidth;
  robo.classList.add("animar-pulo");

  if (pos === config.alvo) {
    document.getElementById("feedback").innerText = "🎉 Missão completa!";
    document.getElementById("proximaFase").disabled = false;
  }
}

function limpar() {
  carregarFase(faseAtual);
}

function proximaFase() {
  carregarFase(faseAtual + 1);
  document.getElementById("proximaFase").disabled = true;
}