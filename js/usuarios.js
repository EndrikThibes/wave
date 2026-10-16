// =====================================================
// USUÁRIOS (banco de dados de mentira)
// Como o projeto não tem back-end, as contas ficam salvas
// no localStorage do navegador. Só serve para a demonstração:
// num site de verdade a senha NUNCA é guardada assim.
// =====================================================

// Conta de teste: sempre existe
const USUARIO_DEMO = {
  nome: "Endrik",
  email: "demo@wave.com",
  senha: "Wave1234",
  generos: ["Pop", "Lo-Fi", "Indie"]
};

// Pega a lista de contas criadas no cadastro
function pegarUsuarios() {
  const texto = localStorage.getItem("wave-usuarios");
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
}

// Procura uma conta pelo e-mail. Devolve o usuário ou null se não achar.
function buscarUsuario(email) {
  email = email.trim().toLowerCase();

  if (email === USUARIO_DEMO.email) {
    return USUARIO_DEMO;
  }

  const usuarios = pegarUsuarios();
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email.toLowerCase() === email) {
      return usuarios[i];
    }
  }
  return null;
}

// Guarda uma conta nova (usado no cadastro)
function salvarUsuario(usuario) {
  const usuarios = pegarUsuarios();
  usuarios.push(usuario);
  localStorage.setItem("wave-usuarios", JSON.stringify(usuarios));
}

// "Login": guarda quem está logado agora
function iniciarSessao(usuario) {
  const sessao = {
    nome: usuario.nome,
    email: usuario.email,
    generos: usuario.generos
  };
  localStorage.setItem("wave-sessao", JSON.stringify(sessao));
}

// Confere e-mail e senha. Devolve o usuário se estiver certo, ou null se estiver errado.
function entrar(email, senha) {
  const usuario = buscarUsuario(email);
  if (usuario === null || usuario.senha !== senha) {
    return null;
  }
  iniciarSessao(usuario);
  return usuario;
}

// Quem está logado agora? (null = ninguém)
function usuarioLogado() {
  const texto = localStorage.getItem("wave-sessao");
  if (texto === null) {
    return null;
  }
  return JSON.parse(texto);
}

function sair() {
  localStorage.removeItem("wave-sessao");
}
