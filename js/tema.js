// =====================================================
// TEMA CLARO / ESCURO
// O tema fica guardado no navegador (localStorage) e é
// aplicado no <html> com o atributo data-theme.
// O CSS (variaveis.css) troca as cores a partir desse atributo.
// =====================================================

// 1) Assim que a página abre, lê o tema que foi salvo.
//    Se nunca foi salvo nada, usa o escuro (que é o padrão).
let temaAtual = localStorage.getItem("wave-theme");
if (temaAtual !== "light") {
  temaAtual = "dark";
}
document.documentElement.setAttribute("data-theme", temaAtual);

// 2) Troca o texto do botão (para leitores de tela) conforme o tema
function atualizarBotao() {
  const botao = document.getElementById("botaoTema");
  if (temaAtual === "light") {
    botao.setAttribute("aria-label", "Mudar para o tema escuro");
  } else {
    botao.setAttribute("aria-label", "Mudar para o tema claro");
  }
}

// 3) Quando o botão for clicado, troca o tema e salva a escolha
function trocarTema() {
  if (temaAtual === "dark") {
    temaAtual = "light";
  } else {
    temaAtual = "dark";
  }
  document.documentElement.setAttribute("data-theme", temaAtual);
  localStorage.setItem("wave-theme", temaAtual);
  atualizarBotao();
}

// O botão só existe depois que a página carrega
document.addEventListener("DOMContentLoaded", function () {
  atualizarBotao();
  document.getElementById("botaoTema").addEventListener("click", trocarTema);
});
