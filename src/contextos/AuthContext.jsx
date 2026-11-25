import { createContext, useContext, useState } from "react";
import {
  CONTA_DEMO,
  ID_VISITANTE,
  VISITANTE,
  atualizarUsuario,
  buscarPorEmail,
  conferirLogin,
  criarUsuario,
  encerrarSessao,
  excluirUsuario,
  gravarDadosDoUsuario,
  removerDadosDoUsuario,
  temConteudo,
  iniciarSessao,
  lerDadosDoUsuario,
  usuarioDaSessao
} from "../servicos/usuarios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioDaSessao);

  const [saiuAgora, setSaiuAgora] = useState(false);

  async function cadastrar(dados) {
    const conta = await criarUsuario(dados);
    const dadosVisitante = lerDadosDoUsuario(ID_VISITANTE);
    let trouxeBiblioteca = false;
    if (temConteudo(dadosVisitante)) {
      gravarDadosDoUsuario(conta.id, dadosVisitante);
      removerDadosDoUsuario(ID_VISITANTE);
      trouxeBiblioteca = true;
    }
    return { conta, trouxeBiblioteca };
  }

  function iniciar(conta, lembrar = true) {
    iniciarSessao(conta.id, lembrar);
    setSaiuAgora(false);
    setUsuario(conta);
  }

  async function entrar(email, senha, lembrar) {
    const encontrado = await conferirLogin(email, senha);
    if (encontrado === null) {
      return false;
    }
    iniciar(encontrado, lembrar);
    return true;
  }

  async function entrarComoDemonstracao() {
    let conta = buscarPorEmail(CONTA_DEMO.email);
    if (conta === null) {
      conta = await criarUsuario(CONTA_DEMO);
    }
    iniciar(conta, true);
  }

  function entrarComoVisitante() {
    iniciar(VISITANTE, true);
  }

  function sair() {
    encerrarSessao();
    setSaiuAgora(true);
    setUsuario(null);
  }

  function editarPerfil(mudancas) {
    const atualizado = atualizarUsuario(usuario.id, mudancas);
    setUsuario(atualizado);
  }

  function apagarConta() {
    excluirUsuario(usuario.id);
    setUsuario(null);
  }

  function exportarDados() {
    const copia = { ...usuario };
    delete copia.sal;
    delete copia.hash;
    return {
      exportadoEm: new Date().toISOString(),
      perfil: copia,
      biblioteca: lerDadosDoUsuario(usuario.id)
    };
  }

  const valor = {
    usuario,
    saiuAgora,
    entrarComoVisitante,
    cadastrar,
    iniciar,
    entrar,
    entrarComoDemonstracao,
    sair,
    editarPerfil,
    apagarConta,
    exportarDados
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
