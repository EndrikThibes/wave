import {
  ler,
  gravar,
  remover,
  lerTexto,
  gravarTexto,
  lerSessaoTemporaria,
  gravarSessaoTemporaria,
  removerSessaoTemporaria
} from "./armazenamento.js";
import { protegerSenha, conferirSenha } from "./senha.js";

const CHAVE_USUARIOS = "wave:usuarios";
const CHAVE_SESSAO = "wave:sessao";
const PREFIXO_DADOS = "wave:dados:";

export function pegarUsuarios() {
  return ler(CHAVE_USUARIOS, []);
}

export function buscarPorEmail(email) {
  const procurado = email.trim().toLowerCase();
  return pegarUsuarios().find((u) => u.email.toLowerCase() === procurado) || null;
}

export function buscarPorId(id) {
  return pegarUsuarios().find((u) => u.id === id) || null;
}

export async function criarUsuario(dados) {
  const protecao = await protegerSenha(dados.senha);
  const usuario = {
    id: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nome: dados.nome.trim(),
    email: dados.email.trim(),
    sal: protecao.sal,
    hash: protecao.hash,
    generos: dados.generos,
    plano: "gratis",
    criadoEm: new Date().toISOString(),
    consentimentoEm: new Date().toISOString()
  };
  const lista = pegarUsuarios();
  lista.push(usuario);
  gravar(CHAVE_USUARIOS, lista);
  return usuario;
}

export async function conferirLogin(email, senha) {
  const usuario = buscarPorEmail(email);
  if (usuario === null) {
    return null;
  }
  const certa = await conferirSenha(senha, usuario.sal, usuario.hash);
  return certa ? usuario : null;
}

export async function redefinirSenha(email, novaSenha) {
  const lista = pegarUsuarios();
  const posicao = lista.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (posicao === -1) {
    return false;
  }
  const protecao = await protegerSenha(novaSenha);
  lista[posicao].sal = protecao.sal;
  lista[posicao].hash = protecao.hash;
  gravar(CHAVE_USUARIOS, lista);
  return true;
}

export function atualizarUsuario(id, mudancas) {
  const lista = pegarUsuarios();
  const posicao = lista.findIndex((u) => u.id === id);
  if (posicao === -1) {
    return null;
  }
  lista[posicao] = { ...lista[posicao], ...mudancas };
  gravar(CHAVE_USUARIOS, lista);
  return lista[posicao];
}

export function excluirUsuario(id) {
  const lista = pegarUsuarios().filter((u) => u.id !== id);
  gravar(CHAVE_USUARIOS, lista);
  remover(PREFIXO_DADOS + id);
  if (lerTexto(CHAVE_SESSAO) === id) {
    remover(CHAVE_SESSAO);
  }
}

export function iniciarSessao(id, lembrar = true) {
  encerrarSessao();
  if (lembrar) {
    gravarTexto(CHAVE_SESSAO, id);
  } else {
    gravarSessaoTemporaria(CHAVE_SESSAO, id);
  }
}

export function encerrarSessao() {
  remover(CHAVE_SESSAO);
  removerSessaoTemporaria(CHAVE_SESSAO);
}

export function usuarioDaSessao() {
  const id = lerSessaoTemporaria(CHAVE_SESSAO) || lerTexto(CHAVE_SESSAO);
  if (id === null) {
    return null;
  }
  return buscarPorId(id);
}

export function lerDadosDoUsuario(id) {
  const padrao = { curtidas: [], playlists: [], historico: [], reproducoes: {} };
  return { ...padrao, ...ler(PREFIXO_DADOS + id, padrao) };
}

export function gravarDadosDoUsuario(id, dados) {
  gravar(PREFIXO_DADOS + id, dados);
}

export async function trocarSenha(id, senhaAtual, novaSenha) {
  const usuario = buscarPorId(id);
  const confere = await conferirSenha(senhaAtual, usuario.sal, usuario.hash);
  if (!confere) {
    return false;
  }
  const protecao = await protegerSenha(novaSenha);
  atualizarUsuario(id, { sal: protecao.sal, hash: protecao.hash });
  return true;
}

export const PREFERENCIAS_PADRAO = { tocarProxima: true, avisarTroca: false, reduzirAnimacoes: false };

export function preferenciasDe(usuario) {
  return { ...PREFERENCIAS_PADRAO, ...(usuario && usuario.preferencias) };
}
