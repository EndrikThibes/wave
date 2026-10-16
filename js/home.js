// =====================================================
// HOME (página provisória depois do login)
// Mostra o nome de quem entrou. Quem não fez login
// é mandado de volta para a tela de login.
// =====================================================

const usuario = usuarioLogado();   // usuarios.js

if (usuario === null) {
  window.location.href = "login.html";
} else {
  // Saudação de acordo com a hora do dia
  const hora = new Date().getHours();
  let saudacao = "Boa noite";
  if (hora < 12) {
    saudacao = "Bom dia";
  } else if (hora < 18) {
    saudacao = "Boa tarde";
  }
  document.getElementById("saudacao").textContent = saudacao + ", " + usuario.nome;

  // E-mail e gêneros escolhidos
  let dados = usuario.email;
  if (usuario.generos.length > 0) {
    dados = dados + " · Gêneros: " + usuario.generos.join(", ");
  }
  document.getElementById("dados").textContent = dados;
}

// Botão Sair
document.getElementById("botaoSair").addEventListener("click", function () {
  sair();   // usuarios.js
  window.location.href = "login.html";
});
