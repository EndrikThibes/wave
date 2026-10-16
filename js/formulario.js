// =====================================================
// FUNÇÕES QUE O LOGIN E O CADASTRO USAM EM COMUM
// =====================================================

// Mostra a mensagem de erro de um campo.
// Exemplo: mostrarErro(campoEmail, "Informe seu e-mail.")
// O parágrafo da mensagem tem o id do campo + "-erro" (ex.: email-erro)
function mostrarErro(campo, mensagem) {
  const paragrafo = document.getElementById(campo.id + "-erro");
  paragrafo.textContent = mensagem;
  paragrafo.hidden = false;             // aparece na tela
  campo.classList.add("input-erro");    // borda e fundo vermelhos (CSS)
  campo.setAttribute("aria-invalid", "true"); // avisa o leitor de tela
}

// Tira o erro de um campo
function limparErro(campo) {
  const paragrafo = document.getElementById(campo.id + "-erro");
  paragrafo.hidden = true;
  campo.classList.remove("input-erro");
  campo.setAttribute("aria-invalid", "false");
}

// Esse campo está com erro agora?
function temErro(campo) {
  return campo.classList.contains("input-erro");
}

// Botão do "olho": mostra ou esconde a senha
// O botão tem data-campo="senha" dizendo qual campo ele controla.
const botoesOlho = document.querySelectorAll(".botao-olho");
for (let i = 0; i < botoesOlho.length; i++) {
  botoesOlho[i].addEventListener("click", function () {
    const botao = this;
    const campo = document.getElementById(botao.dataset.campo);

    if (campo.type === "password") {
      campo.type = "text";
      botao.setAttribute("aria-label", "Ocultar senha");
    } else {
      campo.type = "password";
      botao.setAttribute("aria-label", "Mostrar senha");
    }
  });
}
