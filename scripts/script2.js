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
window.onresize = () => atualizarPosicaoRobo(true);

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
  atualizarFooter();
  document.getElementById("feedback").innerText = "";
  document.getElementById("modal-parabens").style.display = "none";

  const grid = document.querySelector(".grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${config.colunas}, var(--cell-size))`;
  grid.style.gridTemplateRows = `repeat(${config.linhas}, var(--cell-size))`;

  for (let i = 0; i < config.colunas * config.linhas; i++) {
    const div = document.createElement("div");
    if (i === config.alvo) { div.classList.add("alvo"); div.innerText = "⭐"; }
    if (config.obstaculos.includes(i)) { div.classList.add("obstaculo"); div.innerText = "🪨"; }
    grid.appendChild(div);
  }

  const robo = document.createElement("div");
  robo.id = "robo";
  robo.innerText = "🤖";
  grid.appendChild(robo);

  // Esperar o render inicial para posicionar perfeitamente
  setTimeout(() => atualizarPosicaoRobo(true), 50);
}

function atualizarFooter() {
  const progresso = document.getElementById("fase-progresso");
  if (!progresso) return;

  let html = `<span class="material-icons estrela-preenchida">star</span>`;
  html += `<span id="fase-texto">Fase ${faseAtual}</span>`;

  // Apenas efeito estético: adicionar 2 estrelas vazias para mostrar que há mais caminho
  html += `<span class="material-icons estrela-vazia">star_border</span>`;
  html += `<span class="material-icons estrela-vazia">star_border</span>`;

  progresso.innerHTML = html;
}

function atualizarPosicaoRobo(imediato = false) {
  const robo = document.getElementById("robo");
  if (!robo) return;

  const grid = document.querySelector(".grid");
  const cells = grid.querySelectorAll("div:not(#robo)");
  const targetCell = cells[pos];
  if (!targetCell) return;

  const x = targetCell.offsetLeft;
  const y = targetCell.offsetTop;

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
  if (executando) return;
  comandos.push(cmd);
  atualizarSequencia();
}

function desfazer() {
  if (executando || comandos.length === 0) return;
  comandos.pop();
  atualizarSequencia();
}

function atualizarSequencia() {
  const container = document.getElementById("sequencia-slots");
  if (!container) return;

  container.innerHTML = "";

  // Garantir pelo menos 5 caixas na tela, ou mais se a pessoa adicionar mais de 5 comandos
  const totalSlots = Math.max(5, comandos.length + 1);

  for (let i = 0; i < totalSlots; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";

    if (i < comandos.length) {
      const cmd = comandos[i];
      slot.classList.add("preenchido", `cmd-${cmd}`);
      if (cmd === "cima") slot.innerText = "⬆️";
      if (cmd === "baixo") slot.innerText = "⬇️";
      if (cmd === "esquerda") slot.innerText = "⬅️";
      if (cmd === "direita") slot.innerText = "➡️";
    }

    container.appendChild(slot);
  }
}

function preverBatida(cmd) {
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

  return bateu || config.obstaculos.includes(novaPos);
}

function executar() {
  if (executando || comandos.length === 0) return;
  executando = true;

  let i = 0;
  const intervalo = setInterval(() => {
    if (!executando) { clearInterval(intervalo); return; }

    const cmd = comandos[i];

    if (preverBatida(cmd)) {
      clearInterval(intervalo);
      const robo = document.getElementById("robo");
      robo.classList.add("tremer");
      tocarSom("erro");
      registrarEvento('Lógica', faseAtual, 'Erro', 'Batida detectada');

      setTimeout(() => {
        robo.classList.remove("tremer");
        tocarSom("tente_novamente");
        limpar();
        executando = false;
      }, 800);
      return;
    }

    tocarSom(cmd);
    mover(cmd);
    i++;

    if (i >= comandos.length) {
      clearInterval(intervalo);
      setTimeout(() => {
        if (pos !== fases[faseAtual].alvo && executando) {
          tocarSom("tente_novamente");
          limpar();
        }
        executando = false;
      }, 1200);
    }
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

  if (cmd === "direita") novaPos = pos + 1;
  else if (cmd === "esquerda") novaPos = pos - 1;
  else if (cmd === "baixo") novaPos = pos + config.colunas;
  else if (cmd === "cima") novaPos = pos - config.colunas;

  pos = novaPos;
  atualizarPosicaoRobo();

  const robo = document.getElementById("robo");
  robo.classList.remove("animar-pulo");
  void robo.offsetWidth;
  robo.classList.add("animar-pulo");

  if (pos === config.alvo) {
    setTimeout(() => {
      if (pos === config.alvo) {
        registrarEvento('Lógica', faseAtual, 'Acerto', 'Estrela');
        mostrarVitoria();
      }
    }, 800);
  }
}

function mostrarVitoria() {
  const modal = document.getElementById("modal-parabens");
  const titulo = modal.querySelector("h2");
  const botao = modal.querySelector("button");

  if (!fases[faseAtual + 1]) {
    tocarSom("vitoria_final");
    titulo.innerText = "🏆 CAMPEÃO! 🏆";
    botao.innerText = "REINICIAR 🔄";
  } else {
    tocarSom("parabens");
    titulo.innerText = "🌟 PARABÉNS! 🌟";
    botao.innerText = "PRÓXIMA FASE ➡️";
  }

  modal.style.display = "block";

  for (let i = 0; i < 15; i++) {
    setTimeout(criarBalao, i * 300);
  }
}

function criarBalao() {
  const balao = document.createElement("div");
  balao.className = "balao";
  balao.style.left = Math.random() * 90 + "vw";
  balao.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;

  balao.onclick = () => {
    balao.classList.add("estouro");
    tocarSom("estouro");
    setTimeout(() => balao.remove(), 200);
  };

  setTimeout(() => {
    if (balao.parentElement) {
      balao.style.opacity = "0";
      setTimeout(() => balao.remove(), 1000);
    }
  }, 7000);

  document.body.appendChild(balao);
}

function limpar() {
  carregarFase(faseAtual);
}

function proximaFase() {
  if (fases[faseAtual + 1]) {
    carregarFase(faseAtual + 1);
  } else {
    carregarFase(1);
  }
}