let comandos = [];
let pos = 4; // começa no centro

function addComando(cmd) {
  comandos.push(cmd);
  atualizarSequencia();
}

function atualizarSequencia() {
  document.getElementById("sequencia").innerText =
    comandos.join(" → ");
}

function executar() {
  comandos.forEach((cmd, i) => {
    setTimeout(() => {
      mover(cmd);
    }, i * 500);
  });
}

function mover(cmd) {
  let novaPos = pos;

  // MOVIMENTOS COM LIMITE
  if (cmd === "direita" && pos % 3 !== 2) {
    novaPos = pos + 1;
  }

  if (cmd === "esquerda" && pos % 3 !== 0) {
    novaPos = pos - 1;
  }

  if (cmd === "baixo" && pos < 6) {
    novaPos = pos + 3;
  }

  if (cmd === "cima" && pos >= 3) {
    novaPos = pos - 3;
  }

  // se não mudou, ignora (bateu na parede)
  if (novaPos === pos) return;

  const grid = document.querySelector(".grid");
  const celulas = grid.children;

  // limpa posição antiga
  celulas[pos].innerHTML = "";

  // cria novo robô
  const robo = document.createElement("div");
  robo.innerText = "🤖";

  celulas[novaPos].appendChild(robo);

  pos = novaPos;

  // condição de vitória
  if (pos === 8) {
    document.getElementById("feedback").innerText = "🎉 Missão completa!";
  }
}

function limpar() {
  comandos = [];
  atualizarSequencia();
}