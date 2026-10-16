// =====================================================
// TELA DE CADASTRO (3 etapas)
//   Etapa 1: dados da conta (nome, e-mail, senha, termos)
//   Etapa 2: escolher pelo menos 3 gêneros musicais
//   Etapa 3: "Tudo pronto" -> vai para a home
// =====================================================

// Pega os elementos da página
const formulario = document.getElementById("formCadastro");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const campoConfirmar = document.getElementById("confirmar");
const campoTermos = document.getElementById("termos");
const erroTermos = document.getElementById("termos-erro");

// Guarda os dados enquanto a pessoa passa pelas etapas
let dadosDaConta = null;
let generosEscolhidos = [];


// =====================================================
// ETAPA 1 - VALIDAÇÃO DOS CAMPOS
// Cada função devolve true (ok) ou false (com erro)
// =====================================================

function validarNome() {
  const nome = campoNome.value.trim();

  if (nome === "") {
    mostrarErro(campoNome, "Como podemos te chamar?");
    return false;
  }
  if (nome.length < 2) {
    mostrarErro(campoNome, "O nome precisa ter pelo menos 2 letras.");
    return false;
  }
  limparErro(campoNome);
  return true;
}

function validarEmail() {
  const email = campoEmail.value.trim();
  const regraEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    mostrarErro(campoEmail, "Informe seu e-mail.");
    return false;
  }
  if (!regraEmail.test(email)) {
    mostrarErro(campoEmail, "Digite um e-mail válido, como nome@dominio.com.");
    return false;
  }
  // buscarUsuario() está no arquivo usuarios.js
  if (buscarUsuario(email) !== null) {
    mostrarErro(campoEmail, "Este e-mail já tem uma conta. Que tal entrar?");
    return false;
  }
  limparErro(campoEmail);
  return true;
}

function validarSenha() {
  const senha = campoSenha.value;

  if (senha === "") {
    mostrarErro(campoSenha, "Crie uma senha.");
    return false;
  }
  if (senha.length < 8) {
    mostrarErro(campoSenha, "A senha precisa ter pelo menos 8 caracteres.");
    return false;
  }
  // a senha precisa ter pelo menos uma letra e um número
  if (!/[A-Za-z]/.test(senha) || !/[0-9]/.test(senha)) {
    mostrarErro(campoSenha, "Use letras e números na senha.");
    return false;
  }
  limparErro(campoSenha);
  return true;
}

function validarConfirmar() {
  if (campoConfirmar.value === "") {
    mostrarErro(campoConfirmar, "Repita a senha para confirmar.");
    return false;
  }
  if (campoConfirmar.value !== campoSenha.value) {
    mostrarErro(campoConfirmar, "As senhas não são iguais.");
    return false;
  }
  limparErro(campoConfirmar);
  return true;
}

function validarTermos() {
  if (!campoTermos.checked) {
    erroTermos.hidden = false;
    return false;
  }
  erroTermos.hidden = true;
  return true;
}


// =====================================================
// MEDIDOR DE FORÇA DA SENHA
// Dá 1 ponto para cada regra cumprida (máximo 4):
// 8+ caracteres, maiúscula e minúscula, número, símbolo
// =====================================================
function calcularForca(senha) {
  let pontos = 0;

  if (senha.length >= 8) {
    pontos = pontos + 1;
  }
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) {
    pontos = pontos + 1;
  }
  if (/[0-9]/.test(senha)) {
    pontos = pontos + 1;
  }
  if (/[^A-Za-z0-9]/.test(senha)) {
    pontos = pontos + 1;
  }
  // senha preenchida tem pelo menos nível 1
  if (pontos === 0) {
    pontos = 1;
  }
  return pontos;
}

function atualizarForca() {
  const caixa = document.getElementById("forca");
  const texto = document.getElementById("forca-texto");
  const nomes = ["", "Fraca", "Razoável", "Boa", "Forte"];

  if (campoSenha.value === "") {
    caixa.dataset.nivel = "0";
    texto.textContent = "Use letras e números.";
  } else {
    const nivel = calcularForca(campoSenha.value);
    caixa.dataset.nivel = nivel;   // o CSS pinta as barras com esse número
    texto.textContent = "Força da senha: " + nomes[nivel];
  }
}


// =====================================================
// EVENTOS DOS CAMPOS
// =====================================================

// Ao sair do campo (blur): valida, se a pessoa digitou algo
campoNome.addEventListener("blur", function () {
  if (campoNome.value !== "") validarNome();
});
campoEmail.addEventListener("blur", function () {
  if (campoEmail.value !== "") validarEmail();
});
campoSenha.addEventListener("blur", function () {
  if (campoSenha.value !== "") validarSenha();
});
campoConfirmar.addEventListener("blur", function () {
  if (campoConfirmar.value !== "") validarConfirmar();
});
campoTermos.addEventListener("change", validarTermos);

// Ao digitar: se o campo estava com erro, valida de novo na hora
campoNome.addEventListener("input", function () {
  if (temErro(campoNome)) validarNome();
});
campoEmail.addEventListener("input", function () {
  if (temErro(campoEmail)) validarEmail();
});
campoSenha.addEventListener("input", function () {
  atualizarForca();
  if (temErro(campoSenha)) validarSenha();
  // se a confirmação já foi preenchida, confere de novo com a senha nova
  if (campoConfirmar.value !== "") validarConfirmar();
});
campoConfirmar.addEventListener("input", function () {
  if (temErro(campoConfirmar)) validarConfirmar();
});


// =====================================================
// TROCA DE ETAPA
// Só a etapa atual fica visível (as outras têm o atributo hidden)
// =====================================================
function irParaEtapa(numero) {
  for (let i = 1; i <= 3; i++) {
    const secao = document.getElementById("etapa" + i);
    const passo = document.getElementById("passo" + i);

    secao.hidden = (i !== numero);   // esconde todas, menos a atual

    // marca o indicador do topo (1 Conta - 2 Gostos - 3 Pronto)
    passo.classList.remove("atual", "feito");
    passo.removeAttribute("aria-current");
    if (i === numero) {
      passo.classList.add("atual");
      passo.setAttribute("aria-current", "step");
    }
    if (i < numero) {
      passo.classList.add("feito");
    }
  }
  // leva o foco para o título da nova etapa (ajuda quem usa leitor de tela)
  document.getElementById("titulo" + numero).focus();
}


// =====================================================
// ENVIO DA ETAPA 1 (botão Continuar)
// =====================================================
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  // Valida tudo de uma vez, para mostrar todos os erros juntos
  const nomeOk = validarNome();
  const emailOk = validarEmail();
  const senhaOk = validarSenha();
  const confirmarOk = validarConfirmar();
  const termosOk = validarTermos();

  // Leva o cursor para o primeiro campo com erro
  if (!nomeOk) { campoNome.focus(); return; }
  if (!emailOk) { campoEmail.focus(); return; }
  if (!senhaOk) { campoSenha.focus(); return; }
  if (!confirmarOk) { campoConfirmar.focus(); return; }
  if (!termosOk) { campoTermos.focus(); return; }

  // Tudo certo: guarda os dados e vai para a etapa 2
  dadosDaConta = {
    nome: campoNome.value.trim(),
    email: campoEmail.value.trim(),
    senha: campoSenha.value
  };
  irParaEtapa(2);
});


// =====================================================
// ETAPA 2 - ESCOLHER GÊNEROS
// =====================================================
const MINIMO_GENEROS = 3;
const botoesGenero = document.querySelectorAll(".genero");
const contador = document.getElementById("contador");
const botaoConcluir = document.getElementById("concluir");

// Clicar em um gênero: marca ou desmarca
for (let i = 0; i < botoesGenero.length; i++) {
  botoesGenero[i].addEventListener("click", function () {
    const nome = this.dataset.nome;

    if (generosEscolhidos.includes(nome)) {
      // já estava escolhido: tira da lista
      generosEscolhidos = generosEscolhidos.filter(function (g) {
        return g !== nome;
      });
      this.setAttribute("aria-pressed", "false");
    } else {
      // não estava: coloca na lista
      generosEscolhidos.push(nome);
      this.setAttribute("aria-pressed", "true");
    }
    atualizarContador();
  });
}

// Mostra quantos já foram escolhidos e libera o botão Concluir
function atualizarContador() {
  const quantos = generosEscolhidos.length;
  const faltam = MINIMO_GENEROS - quantos;

  if (faltam > 0) {
    contador.innerHTML = "<strong>" + quantos + "</strong> de " + MINIMO_GENEROS + " escolhidos · faltam " + faltam;
    botaoConcluir.disabled = true;
    botaoConcluir.textContent = "Escolha mais " + faltam;
  } else {
    contador.innerHTML = "<strong>" + quantos + "</strong> escolhidos · ótimo!";
    botaoConcluir.disabled = false;
    botaoConcluir.textContent = "Concluir";
  }
}

// Cria a conta, faz o login e mostra a etapa 3
function finalizarCadastro(generos) {
  const usuario = {
    nome: dadosDaConta.nome,
    email: dadosDaConta.email,
    senha: dadosDaConta.senha,
    generos: generos
  };
  salvarUsuario(usuario);   // usuarios.js
  iniciarSessao(usuario);   // usuarios.js

  // Preenche a tela final
  document.getElementById("nomeFinal").textContent = usuario.nome;
  const caixaTags = document.getElementById("tagsFinais");
  caixaTags.innerHTML = "";
  for (let i = 0; i < generos.length; i++) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = generos[i];
    caixaTags.appendChild(tag);
  }

  // Texto muda se a pessoa escolheu gêneros ou pulou
  const textoFinal = document.getElementById("textoFinal");
  if (generos.length > 0) {
    textoFinal.textContent = "Já montamos suas primeiras recomendações com base nos seus gostos.";
  } else {
    textoFinal.textContent = "Você pode escolher seus gêneros depois, nas configurações.";
  }
  irParaEtapa(3);
}

botaoConcluir.addEventListener("click", function () {
  finalizarCadastro(generosEscolhidos);
});

// "Pular por agora": cria a conta sem gêneros
document.getElementById("pular").addEventListener("click", function () {
  finalizarCadastro([]);
});

atualizarContador();
