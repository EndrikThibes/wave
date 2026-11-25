import { createContext, useContext, useEffect, useRef, useState } from "react";
import { faixaPorId, artistaPorId, imagemDaCapa } from "../dados/catalogo.js";
import { carregarApiYoutube } from "../servicos/youtube.js";
import { ler, gravar } from "../servicos/armazenamento.js";
import { useBiblioteca } from "./BibliotecaContext.jsx";
import { useAviso } from "./AvisoContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { preferenciasDe } from "../servicos/usuarios.js";

const PlayerContext = createContext(null);

export const ID_ALVO_VIDEO = "wave-video";
const CHAVE_PLAYER = "wave:player";

export function PlayerProvider({ children }) {
  const biblioteca = useBiblioteca();
  const { mostrar } = useAviso();
  const { usuario } = useAuth();
  const ajustes = preferenciasDe(usuario);
  const preferencias = ler(CHAVE_PLAYER, { volume: 80, aleatorio: false, repetir: "nao" });

  const [fila, setFila] = useState([]);
  const [indice, setIndice] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [volume, setVolume] = useState(preferencias.volume);
  const [aleatorio, setAleatorio] = useState(preferencias.aleatorio);
  const [repetir, setRepetir] = useState(preferencias.repetir);
  const [painelAberto, setPainelAberto] = useState(false);

  const playerRef = useRef(null);
  const criandoRef = useRef(null);
  const alternativaRef = useRef(0);
  const ultimaFuncao = useRef({});

  const faixaAtual = fila.length > 0 ? faixaPorId(fila[indice]) : null;

  useEffect(() => {
    gravar(CHAVE_PLAYER, { volume, aleatorio, repetir });
  }, [volume, aleatorio, repetir]);

  useEffect(() => {
    if (!tocando) {
      return undefined;
    }
    const relogio = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === "function") {
        setProgresso(player.getCurrentTime());
        const total = player.getDuration();
        if (total > 0) {
          setDuracao(total);
        }
      }
    }, 500);
    return () => clearInterval(relogio);
  }, [tocando]);

  function criarPlayer() {
    if (playerRef.current !== null) {
      return Promise.resolve(playerRef.current);
    }
    if (criandoRef.current !== null) {
      return criandoRef.current;
    }
    criandoRef.current = carregarApiYoutube().then(
      () =>
        new Promise((resolve) => {
          const player = new window.YT.Player(ID_ALVO_VIDEO, {
            host: "https://www.youtube-nocookie.com",
            width: "100%",
            height: "100%",
            playerVars: {
              controls: 0,
              disablekb: 1,
              playsinline: 1,
              rel: 0,
              modestbranding: 1,
              iv_load_policy: 3,
              origin: window.location.origin
            },
            events: {
              onReady: () => {
                playerRef.current = player;
                resolve(player);
              },
              onStateChange: (evento) => ultimaFuncao.current.aoMudarEstado(evento.data),
              onError: () => ultimaFuncao.current.aoErrar()
            }
          });
        })
    );
    criandoRef.current.catch(() => {
      criandoRef.current = null;
    });
    return criandoRef.current;
  }

  async function carregarFaixa(faixaId) {
    const faixa = faixaPorId(faixaId);
    alternativaRef.current = 0;
    setCarregando(true);
    setProgresso(0);
    setDuracao(faixa.duracao);
    biblioteca.registrarNoHistorico(faixaId);
    if (ajustes.avisarTroca) {
      mostrar("Tocando agora: " + faixa.titulo + ", de " + artistaPorId(faixa.artistaId).nome + ".");
    }
    try {
      const player = await criarPlayer();
      player.setVolume(volume);
      player.loadVideoById(faixa.video[0]);
    } catch {
      setCarregando(false);
      setTocando(false);
      mostrar("Não foi possível falar com o YouTube. Confira sua conexão e tente de novo.");
    }
  }

  function tocarLista(ids, faixaId) {
    const posicao = Math.max(0, ids.indexOf(faixaId));
    setFila(ids);
    setIndice(posicao);
    setTocando(true);
    carregarFaixa(ids[posicao]);
  }

  function irParaIndice(novoIndice) {
    setIndice(novoIndice);
    setTocando(true);
    carregarFaixa(fila[novoIndice]);
  }

  function proxima(automatico) {
    if (fila.length === 0) {
      return;
    }
    if (aleatorio && fila.length > 1) {
      let sorteado = indice;
      while (sorteado === indice) {
        sorteado = Math.floor(Math.random() * fila.length);
      }
      irParaIndice(sorteado);
      return;
    }
    if (indice < fila.length - 1) {
      irParaIndice(indice + 1);
      return;
    }
    if (repetir === "tudo" || !automatico) {
      irParaIndice(0);
      return;
    }
    setTocando(false);
    setProgresso(0);
  }

  function anterior() {
    if (fila.length === 0) {
      return;
    }
    if (progresso > 3) {
      buscar(0);
      return;
    }
    irParaIndice(indice > 0 ? indice - 1 : fila.length - 1);
  }

  function alternar() {
    const player = playerRef.current;
    if (player === null || faixaAtual === null) {
      return;
    }
    if (tocando) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  function buscar(segundos) {
    const player = playerRef.current;
    if (player !== null) {
      player.seekTo(segundos, true);
      setProgresso(segundos);
    }
  }

  function mudarVolume(valor) {
    setVolume(valor);
    if (playerRef.current !== null) {
      playerRef.current.setVolume(valor);
    }
  }

  function alternarAleatorio() {
    setAleatorio(!aleatorio);
  }

  function alternarRepeticao() {
    if (repetir === "nao") {
      setRepetir("tudo");
    } else if (repetir === "tudo") {
      setRepetir("um");
    } else {
      setRepetir("nao");
    }
  }

  function adicionarNaFila(faixaId) {
    if (fila.length === 0) {
      tocarLista([faixaId], faixaId);
      return;
    }
    if (fila.includes(faixaId)) {
      mostrar("Essa música já está na fila.");
      return;
    }
    setFila([...fila, faixaId]);
    mostrar("Adicionada à fila.");
  }

  function fecharPlayer() {
    if (playerRef.current !== null) {
      playerRef.current.stopVideo();
    }
    setFila([]);
    setIndice(0);
    setTocando(false);
    setProgresso(0);
    setPainelAberto(false);
  }

  function aoMudarEstado(estado) {
    if (estado === 1) {
      setTocando(true);
      setCarregando(false);
      const total = playerRef.current.getDuration();
      if (total > 0) {
        setDuracao(total);
      }
    } else if (estado === 2) {
      setTocando(false);
    } else if (estado === 3) {
      setCarregando(true);
    } else if (estado === 0) {
      if (repetir === "um") {
        playerRef.current.seekTo(0, true);
        playerRef.current.playVideo();
      } else if (ajustes.tocarProxima) {
        proxima(true);
      } else {
        setTocando(false);
      }
    }
  }

  function aoErrar() {
    const faixa = faixaAtual;
    if (faixa === null) {
      return;
    }
    const proximaAlternativa = alternativaRef.current + 1;
    if (proximaAlternativa < faixa.video.length) {
      alternativaRef.current = proximaAlternativa;
      playerRef.current.loadVideoById(faixa.video[proximaAlternativa]);
      return;
    }
    setCarregando(false);
    mostrar("“" + faixa.titulo + "” não pôde ser tocada aqui. Passando para a próxima.");
    if (fila.length > 1) {
      proxima(true);
    } else {
      setTocando(false);
    }
  }

  useEffect(() => {
    if (!("mediaSession" in navigator) || faixaAtual === null) {
      return;
    }
    const artista = artistaPorId(faixaAtual.artistaId);
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: faixaAtual.titulo,
      artist: artista.nome,
      album: faixaAtual.album,
      artwork: [{ src: imagemDaCapa(faixaAtual, 300), sizes: "300x300", type: "image/jpeg" }]
    });
    navigator.mediaSession.setActionHandler("play", () => ultimaFuncao.current.alternar());
    navigator.mediaSession.setActionHandler("pause", () => ultimaFuncao.current.alternar());
    navigator.mediaSession.setActionHandler("nexttrack", () => ultimaFuncao.current.proxima(false));
    navigator.mediaSession.setActionHandler("previoustrack", () => ultimaFuncao.current.anterior());
  }, [faixaAtual]);

  useEffect(() => {
    ultimaFuncao.current = { aoMudarEstado, aoErrar, alternar, proxima, anterior };
  });

  const valor = {
    fila,
    indice,
    faixaAtual,
    tocando,
    carregando,
    progresso,
    duracao,
    volume,
    aleatorio,
    repetir,
    painelAberto,
    setPainelAberto,
    tocarLista,
    irParaIndice,
    proxima,
    anterior,
    alternar,
    buscar,
    mudarVolume,
    alternarAleatorio,
    alternarRepeticao,
    adicionarNaFila,
    fecharPlayer
  };

  return <PlayerContext.Provider value={valor}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  return useContext(PlayerContext);
}
