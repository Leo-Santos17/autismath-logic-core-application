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

  pos = novaPos;
  const robo = document.getElementById("robo");

  // calcular grade: 80px + 10px gap = 90px
  const x = (pos % 3) * 90;
  const y = Math.floor(pos / 3) * 90;

  // aplicar posição
  robo.style.left = x + "px";
  robo.style.top = y + "px";

  // dar o pulo
  robo.classList.remove("animar-pulo");
  void robo.offsetWidth; // truque para reiniciar animação
  robo.classList.add("animar-pulo");

  // condição de vitória
  if (pos === 8) {
    document.getElementById("feedback").innerText = "🎉 Missão completa!";
  }
}

function limpar() {
  comandos = [];
  pos = 4; // volta para o centro
  atualizarSequencia();

  const robo = document.getElementById("robo");
  robo.style.left = "90px";
  robo.style.top = "90px";
  robo.classList.remove("animar-pulo");

  document.getElementById("feedback").innerText = "";
}