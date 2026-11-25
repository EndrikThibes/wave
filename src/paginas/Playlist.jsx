import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Dialogo from "../componentes/Dialogo.jsx";
import CamposPlaylist from "../componentes/CamposPlaylist.jsx";
import Icone from "../componentes/Icone.jsx";
import ListaFaixas from "../componentes/ListaFaixas.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { useAviso } from "../contextos/AvisoContext.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { faixaPorId } from "../dados/catalogo.js";
import { formatarTempo } from "../servicos/youtube.js";
import { useTitulo } from "../servicos/useTitulo.js";

export default function Playlist() {
  const { id } = useParams();
  const biblioteca = useBiblioteca();
  const { mostrar } = useAviso();
  const player = usePlayer();
  const navegar = useNavigate();
  const playlist = biblioteca.playlists.find((p) => p.id === id);
  useTitulo(playlist ? playlist.nome : "Playlist não encontrada");

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [publica, setPublica] = useState(false);
  const [erro, setErro] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  if (!playlist) {
    return <Navigate to="/biblioteca" replace />;
  }

  const segundos = playlist.faixas.reduce((total, faixaId) => total + faixaPorId(faixaId).duracao, 0);

  function abrirEdicao() {
    setNome(playlist.nome);
    setPublica(Boolean(playlist.publica));
    setErro("");
    setEditando(true);
  }

  function renomear(evento) {
    evento.preventDefault();
    const mensagem = biblioteca.editarPlaylist(playlist.id, nome, publica);
    if (mensagem !== "") {
      setErro(mensagem);
      document.getElementById("editar-playlist-nome").focus();
      return;
    }
    setEditando(false);
    mostrar("Playlist atualizada.");
  }

  function excluir() {
    const copia = playlist;
    biblioteca.excluirPlaylist(playlist.id);
    setExcluindo(false);
    navegar("/biblioteca");
    mostrar("Playlist " + copia.nome + " excluída.");
  }

  function remover(faixaId) {
    const posicao = biblioteca.removerDaPlaylist(playlist.id, faixaId);
    mostrar("Música removida da playlist.", {
      rotulo: "Desfazer",
      aoClicar: () => biblioteca.reinserirNaPlaylist(playlist.id, faixaId, posicao)
    });
  }

  return (
    <>
      <p>
        <Link to="/biblioteca" className="voltar">
          <Icone nome="voltar" tamanho={18} />
          Voltar para a biblioteca
        </Link>
      </p>
      <header className="cabecalho-pagina">
        <div>
          <p className="rotulo">{playlist.publica ? "Playlist pública" : "Playlist privada"}</p>
          <h1 className="titulo-pagina">{playlist.nome}</h1>
          <p className="dica">
            {playlist.faixas.length} músicas{playlist.faixas.length > 0 && " · " + formatarTempo(segundos)}
          </p>
        </div>
        <div className="acoes-linha">
          {playlist.faixas.length > 0 && (
            <button
              type="button"
              className="botao botao-azul"
              onClick={() => player.tocarLista(playlist.faixas, playlist.faixas[0])}
            >
              <Icone nome="play" tamanho={20} />
              Tocar playlist
            </button>
          )}
          <button type="button" className="botao botao-borda" onClick={abrirEdicao}>
            <Icone nome="editar" tamanho={18} />
            Editar playlist
          </button>
          <button type="button" className="botao botao-perigo" onClick={() => setExcluindo(true)}>
            <Icone nome="lixeira" tamanho={18} />
            Excluir playlist
          </button>
        </div>
      </header>

      {playlist.faixas.length === 0 ? (
        <div className="vazio">
          <Icone nome="nota" tamanho={40} />
          <h2>Esta playlist está vazia</h2>
          <p>Busque uma música e use o botão + para adicioná-la aqui.</p>
          <Link to="/buscar" className="botao botao-azul">
            Buscar músicas
          </Link>
        </div>
      ) : (
        <ListaFaixas
          ids={playlist.faixas}
          rotuloLista={"Músicas de " + playlist.nome}
          acaoExtra={(faixaId) => (
            <button
              type="button"
              className="botao-icone"
              aria-label={"Remover " + faixaPorId(faixaId).titulo + " da playlist"}
              onClick={() => remover(faixaId)}
            >
              <Icone nome="lixeira" />
            </button>
          )}
        />
      )}

      <Dialogo aberto={editando} aoFechar={() => setEditando(false)} titulo="Editar playlist">
        <form className="formulario" onSubmit={renomear} noValidate>
          <CamposPlaylist
            idBase="editar-playlist"
            nome={nome}
            aoMudarNome={(valor) => {
              setNome(valor);
              setErro("");
            }}
            erro={erro}
            publica={publica}
            aoMudarPublica={setPublica}
          />
          <div className="dialogo-acoes">
            <button type="button" className="botao botao-borda" onClick={() => setEditando(false)}>
              Cancelar
            </button>
            <button type="submit" className="botao botao-azul">
              Salvar alterações
            </button>
          </div>
        </form>
      </Dialogo>

      <Dialogo aberto={excluindo} aoFechar={() => setExcluindo(false)} titulo="Excluir esta playlist?">
        <p className="dialogo-texto">
          A playlist “{playlist.nome}” e a lista de músicas dela serão apagadas deste navegador. As músicas continuam no
          catálogo.
        </p>
        <div className="dialogo-acoes">
          <button type="button" className="botao botao-borda" onClick={() => setExcluindo(false)}>
            Manter playlist
          </button>
          <button type="button" className="botao botao-perigo" onClick={excluir}>
            Excluir playlist
          </button>
        </div>
      </Dialogo>
    </>
  );
}
