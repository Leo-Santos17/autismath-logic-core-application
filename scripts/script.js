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

function registrarEvento(tipo, fase, status, detalhe) {
    const dados = JSON.parse(localStorage.getItem('autismath_stats') || '[]');
    dados.push({
        tipo: tipo,
        fase: fase,
        status: status,
        detalhe: detalhe,
        data: new Date().toLocaleString()
    });
    localStorage.setItem('autismath_stats', JSON.stringify(dados));
}

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
        feedback.style.color = "#4CAF50";
        feedback.innerText = "🌟 Parabéns! Você acertou!";
        
        registrarEvento('Matemática', indiceAtual + 1, 'Acerto', `Respondeu ${correta} corretamente`);
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
        registrarEvento('Matemática', indiceAtual + 1, 'Erro', `Selecionou ${selecionados} em vez de ${correta}`);
    }
}

function telaFinal() {
    instrucao.innerText = "🏆 Excelente Trabalho!";
    grid.innerHTML = "";
    feedback.innerText = "Você concluiu todos os desafios de Matemática!";
    
    // Transforma o botão principal em Próxima Etapa (Lógica)
    btnCheck.innerHTML = '<span class="material-icons">psychology</span> IR PARA LÓGICA';
    btnCheck.onclick = () => {
        window.location.href = 'index2.html';
    };

    // Adiciona botão de ver resultados
    const btnResult = document.createElement("button");
    btnResult.className = "btn-secundario";
    btnResult.style.marginTop = "10px";
    btnResult.innerHTML = '<span class="material-icons">bar_chart</span> VER RESULTADOS';
    btnResult.onclick = () => window.location.href = 'resul.html';
    grid.appendChild(btnResult);
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