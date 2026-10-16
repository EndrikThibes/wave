// =====================================================
// TELA DE LOGIN
// 1) Valida o e-mail e a senha (ao sair do campo e ao enviar)
// 2) Confere se a conta existe
// 3) Se estiver tudo certo, vai para a home
// =====================================================

// Pega os elementos da página
const formulario = document.getElementById("formLogin");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const alerta = document.getElementById("alerta");
const alertaTexto = document.getElementById("alertaTexto");
const aviso = document.getElementById("aviso");


// ---------- Validação de cada campo ----------
// Cada função devolve true (campo ok) ou false (campo com erro)

function validarEmail() {
  const email = campoEmail.value.trim();
  // regra de e-mail: texto + @ + texto + . + texto
  const regraEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    mostrarErro(campoEmail, "Informe seu e-mail.");
    return false;
  }
  if (!regraEmail.test(email)) {
    mostrarErro(campoEmail, "Digite um e-mail válido, como nome@dominio.com.");
    return false;
  }
  limparErro(campoEmail);
  return true;
}

function validarSenha() {
  if (campoSenha.value === "") {
    mostrarErro(campoSenha, "Digite sua senha.");
    return false;
  }
  limparErro(campoSenha);
  return true;
}


// ---------- Eventos dos campos ----------

// Ao sair do campo (blur): valida, mas só se a pessoa digitou algo
campoEmail.addEventListener("blur", function () {
  if (campoEmail.value !== "") {
    validarEmail();
  }
});
campoSenha.addEventListener("blur", function () {
  if (campoSenha.value !== "") {
    validarSenha();
  }
});

// Ao digitar: some o alerta e, se o campo estava com erro, valida de novo
campoEmail.addEventListener("input", function () {
  alerta.hidden = true;
  if (temErro(campoEmail)) {
    validarEmail();
  }
});
campoSenha.addEventListener("input", function () {
  alerta.hidden = true;
  if (temErro(campoSenha)) {
    validarSenha();
  }
});


// ---------- Envio do formulário (botão Entrar) ----------
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // impede a página de recarregar
  alerta.hidden = true;

  // Valida os dois campos (as duas mensagens aparecem de uma vez)
  const emailOk = validarEmail();
  const senhaOk = validarSenha();

  // Se algum estiver errado, leva o cursor para o primeiro campo com erro
  if (!emailOk) {
    campoEmail.focus();
    return;
  }
  if (!senhaOk) {
    campoSenha.focus();
    return;
  }

  // Confere e-mail e senha na lista de usuários (arquivo usuarios.js)
  const usuario = entrar(campoEmail.value, campoSenha.value);

  if (usuario === null) {
    alertaTexto.textContent = "E-mail ou senha incorretos. Confira os dados e tente de novo.";
    alerta.hidden = false;
    campoSenha.select();
  } else {
    window.location.href = "home.html";
  }
});


// ---------- Mensagem rápida (aviso) ----------
function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add("mostrar");
  setTimeout(function () {
    aviso.classList.remove("mostrar");
  }, 2800);
}

// Login com Google / Conta Apple (simulado: não tem servidor,
// então entra com a conta de teste)
const botoesSociais = document.querySelectorAll(".botao-social");
for (let i = 0; i < botoesSociais.length; i++) {
  botoesSociais[i].addEventListener("click", function () {
    mostrarAviso("Simulando login com " + this.dataset.nome + " (sem back-end)…");
    iniciarSessao(USUARIO_DEMO);
    setTimeout(function () {
      window.location.href = "home.html";
    }, 1100);
  });
}

// "Esqueci a senha": ainda não existe
document.getElementById("esqueciSenha").addEventListener("click", function (evento) {
  evento.preventDefault();
  mostrarAviso("A recuperação de senha entra no próximo checkpoint.");
});
