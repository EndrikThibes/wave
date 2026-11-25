import { createContext, useContext, useState } from "react";
import {
  atualizarUsuario,
  conferirLogin,
  criarUsuario,
  encerrarSessao,
  excluirUsuario,
  iniciarSessao,
  lerDadosDoUsuario,
  trocarSenha,
  usuarioDaSessao
} from "../servicos/usuarios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioDaSessao);

  const [saiuAgora, setSaiuAgora] = useState(false);

  async function cadastrar(dados) {
    return criarUsuario(dados);
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

  function sair() {
    encerrarSessao();
    setSaiuAgora(true);
    setUsuario(null);
  }

  function editarPerfil(mudancas) {
    const atualizado = atualizarUsuario(usuario.id, mudancas);
    setUsuario(atualizado);
  }

  async function mudarSenha(atual, nova) {
    return trocarSenha(usuario.id, atual, nova);
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
    cadastrar,
    iniciar,
    entrar,
    sair,
    editarPerfil,
    mudarSenha,
    apagarConta,
    exportarDados
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
