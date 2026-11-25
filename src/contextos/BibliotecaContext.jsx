import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { gravarDadosDoUsuario, lerDadosDoUsuario } from "../servicos/usuarios.js";
import { validarNomePlaylist } from "../servicos/validacao.js";

const BibliotecaContext = createContext(null);

const LIMITE_HISTORICO = 20;

export function BibliotecaProvider({ children }) {
  const { usuario } = useAuth();
  const idUsuario = usuario === null ? null : usuario.id;
  const [dados, setDados] = useState(() => (idUsuario === null ? null : lerDadosDoUsuario(idUsuario)));

  useEffect(() => {
    setDados(idUsuario === null ? null : lerDadosDoUsuario(idUsuario));
  }, [idUsuario]);

  function salvar(novosDados) {
    setDados(novosDados);
    gravarDadosDoUsuario(idUsuario, novosDados);
  }

  if (dados === null) {
    return <BibliotecaContext.Provider value={null}>{children}</BibliotecaContext.Provider>;
  }

  function estaCurtida(faixaId) {
    return dados.curtidas.includes(faixaId);
  }

  function alternarCurtida(faixaId) {
    if (estaCurtida(faixaId)) {
      salvar({ ...dados, curtidas: dados.curtidas.filter((id) => id !== faixaId) });
      return false;
    }
    salvar({ ...dados, curtidas: [faixaId, ...dados.curtidas] });
    return true;
  }

  function criarPlaylist(nome, faixaInicial, publica = false) {
    const nomes = dados.playlists.map((p) => p.nome);
    const erro = validarNomePlaylist(nome, nomes);
    if (erro !== "") {
      return { erro, playlist: null };
    }
    const playlist = {
      id: "p" + Date.now().toString(36),
      nome: nome.trim(),
      faixas: faixaInicial ? [faixaInicial] : [],
      publica,
      criadaEm: new Date().toISOString()
    };
    salvar({ ...dados, playlists: [...dados.playlists, playlist] });
    return { erro: "", playlist };
  }

  function editarPlaylist(id, nome, publica) {
    const outros = dados.playlists.filter((p) => p.id !== id).map((p) => p.nome);
    const erro = validarNomePlaylist(nome, outros);
    if (erro !== "") {
      return erro;
    }
    const playlists = dados.playlists.map((p) => (p.id === id ? { ...p, nome: nome.trim(), publica } : p));
    salvar({ ...dados, playlists });
    return "";
  }

  function excluirPlaylist(id) {
    salvar({ ...dados, playlists: dados.playlists.filter((p) => p.id !== id) });
  }

  function adicionarNaPlaylist(playlistId, faixaId) {
    const playlist = dados.playlists.find((p) => p.id === playlistId);
    if (playlist.faixas.includes(faixaId)) {
      return false;
    }
    const playlists = dados.playlists.map((p) =>
      p.id === playlistId ? { ...p, faixas: [...p.faixas, faixaId] } : p
    );
    salvar({ ...dados, playlists });
    return true;
  }

  function removerDaPlaylist(playlistId, faixaId) {
    const playlist = dados.playlists.find((p) => p.id === playlistId);
    const posicao = playlist.faixas.indexOf(faixaId);
    const playlists = dados.playlists.map((p) =>
      p.id === playlistId ? { ...p, faixas: p.faixas.filter((id) => id !== faixaId) } : p
    );
    salvar({ ...dados, playlists });
    return posicao;
  }

  function reinserirNaPlaylist(playlistId, faixaId, posicao) {
    const playlists = dados.playlists.map((p) => {
      if (p.id !== playlistId || p.faixas.includes(faixaId)) {
        return p;
      }
      const faixas = [...p.faixas];
      faixas.splice(posicao, 0, faixaId);
      return { ...p, faixas };
    });
    salvar({ ...dados, playlists });
  }

  function registrarNoHistorico(faixaId) {
    const semRepetida = dados.historico.filter((id) => id !== faixaId);
    const reproducoes = { ...dados.reproducoes, [faixaId]: (dados.reproducoes[faixaId] || 0) + 1 };
    salvar({ ...dados, historico: [faixaId, ...semRepetida].slice(0, LIMITE_HISTORICO), reproducoes });
  }

  function limparHistorico() {
    salvar({ ...dados, historico: [], reproducoes: {} });
  }

  const valor = {
    curtidas: dados.curtidas,
    playlists: dados.playlists,
    historico: dados.historico,
    reproducoes: dados.reproducoes,
    estaCurtida,
    alternarCurtida,
    criarPlaylist,
    editarPlaylist,
    excluirPlaylist,
    adicionarNaPlaylist,
    removerDaPlaylist,
    reinserirNaPlaylist,
    registrarNoHistorico,
    limparHistorico
  };

  return <BibliotecaContext.Provider value={valor}>{children}</BibliotecaContext.Provider>;
}

export function useBiblioteca() {
  return useContext(BibliotecaContext);
}
