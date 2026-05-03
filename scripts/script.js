const exercicios = [
    { pergunta: "Preencha 5 blocos", resposta: 5, dica: "Selecione 5 quadradinhos" },
    { pergunta: "Quanto é 2 + 2?", resposta: 4, dica: "2 mais 2 é igual a 4" },
    { pergunta: "Quanto é 6 - 3?", resposta: 3, dica: "Pense em 6 e tire 3" },
    { pergunta: "Quanto é 1 + 4?", resposta: 5, dica: "O resultado é 5" },
    { pergunta: "Quanto é 8 - 2?", resposta: 6, dica: "8 menos 2 sobra 6" }
];

let indiceAtual = 0;
const grid = document.getElementById("grid-simples");
const instrucao = document.getElementById("instrucao");
const feedback = document.getElementById("msg-feedback");
const btnCheck = document.querySelector(".btn-check");

function iniciarExercicio() {
    grid.innerHTML = ""; 
    const item = exercicios[indiceAtual];
    instrucao.innerText = item.pergunta;
    btnCheck.innerHTML = '<span class="material-icons">check_circle</span> VERIFICAR';
    btnCheck.onclick = validar;
    
    for (let i = 0; i < 12; i++) {
        const div = document.createElement("div");
        div.classList.add("bloco");
        div.onclick = () => {
            div.classList.toggle("selecionado");
            feedback.innerText = ""; 
        };
        grid.appendChild(div);
    }
}

function validar() {
    const selecionados = document.querySelectorAll(".selecionado").length;
    const correta = exercicios[indiceAtual].resposta;

    if (selecionados === correta) {
        feedback.style.color = "var(--verde-primario)";
        feedback.innerText = "🌟 Parabéns! Você acertou!";
        
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        setTimeout(() => {
            indiceAtual++;
            if (indiceAtual < exercicios.length) {
                iniciarExercicio();
                feedback.innerText = "";
            } else {
                telaFinal();
            }
        }, 2000);
    } else {
        feedback.style.color = "#D32F2F";
        feedback.innerText = "Tente contar novamente.";
    }
}

function telaFinal() {
    instrucao.innerText = "🏆 Excelente Trabalho!";
    grid.innerHTML = "";
    feedback.innerText = "Você concluiu todos os desafios!";
    
    // Transforma o botão principal em Reiniciar
    btnCheck.innerHTML = '<span class="material-icons">refresh</span> REINICIAR';
    btnCheck.onclick = reiniciar;
}

function reiniciar() {
    indiceAtual = 0;
    feedback.innerText = "";
    iniciarExercicio();
}

function limpar() {
    document.querySelectorAll(".bloco").forEach(b => b.classList.remove("selecionado"));
    feedback.innerText = "";
}

function ajuda() {
    feedback.style.color = "#2196F3";
    feedback.innerText = `💡 ${exercicios[indiceAtual].dica}`;
}

iniciarExercicio();