const REGRA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarNome(valor) {
  const nome = valor.trim();
  if (nome === "") {
    return "Como podemos te chamar?";
  }
  if (nome.length < 2) {
    return "O nome precisa ter pelo menos 2 letras.";
  }
  return "";
}

export function validarEmail(valor) {
  const email = valor.trim();
  if (email === "") {
    return "Informe seu e-mail.";
  }
  if (!REGRA_EMAIL.test(email)) {
    return "Digite um e-mail válido, como nome@dominio.com.";
  }
  return "";
}

export function validarSenhaNova(senha) {
  if (senha === "") {
    return "Crie uma senha.";
  }
  if (senha.length < 8) {
    return "A senha precisa ter pelo menos 8 caracteres.";
  }
  if (!/[A-Za-z]/.test(senha) || !/[0-9]/.test(senha)) {
    return "Use letras e números na senha.";
  }
  return "";
}

export function validarConfirmacao(senha, confirmacao) {
  if (confirmacao === "") {
    return "Repita a senha para confirmar.";
  }
  if (confirmacao !== senha) {
    return "As senhas não são iguais.";
  }
  return "";
}

export function validarNomePlaylist(valor, nomesExistentes) {
  const nome = valor.trim();
  if (nome === "") {
    return "Dê um nome para a playlist.";
  }
  if (nome.length > 40) {
    return "Use no máximo 40 caracteres.";
  }
  const repetido = nomesExistentes.some((n) => n.toLowerCase() === nome.toLowerCase());
  if (repetido) {
    return "Você já tem uma playlist com esse nome.";
  }
  return "";
}
