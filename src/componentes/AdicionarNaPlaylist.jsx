import { useState } from "react";
import Dialogo from "./Dialogo.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { useAviso } from "../contextos/AvisoContext.jsx";
import { faixaPorId } from "../dados/catalogo.js";

export default function AdicionarNaPlaylist({ faixaId, aberto, aoFechar }) {
  const biblioteca = useBiblioteca();
  const { mostrar } = useAviso();
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  if (faixaId === null) {
    return null;
  }
  const faixa = faixaPorId(faixaId);

  function fechar() {
    setNome("");
    setErro("");
    aoFechar();
  }

  function adicionar(playlist) {
    const adicionou = biblioteca.adicionarNaPlaylist(playlist.id, faixaId);
    if (adicionou) {
      mostrar("Adicionada a " + playlist.nome + ".");
    } else {
      mostrar("Essa música já está em " + playlist.nome + ".");
    }
    fechar();
  }

  function criarEAdicionar(evento) {
    evento.preventDefault();
    const resultado = biblioteca.criarPlaylist(nome, faixaId);
    if (resultado.erro !== "") {
      setErro(resultado.erro);
      return;
    }
    mostrar("Playlist " + resultado.playlist.nome + " criada com a música.");
    fechar();
  }

  return (
    <Dialogo aberto={aberto} aoFechar={fechar} titulo="Adicionar à playlist">
      <p className="dialogo-texto">“{faixa.titulo}”</p>
      {biblioteca.playlists.length > 0 && (
        <ul className="lista-escolha" aria-label="Suas playlists">
          {biblioteca.playlists.map((playlist) => (
            <li key={playlist.id}>
              <button type="button" className="botao botao-borda botao-cheio" onClick={() => adicionar(playlist)}>
                {playlist.nome}
                <span className="dica"> · {playlist.faixas.length} músicas</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <form className="formulario" onSubmit={criarEAdicionar} noValidate>
        <div className="campo">
          <label htmlFor="nova-playlist-musica">Ou crie uma nova playlist</label>
          <input
            id="nova-playlist-musica"
            value={nome}
            placeholder="Nome da playlist"
            aria-invalid={erro ? "true" : "false"}
            aria-describedby={erro ? "nova-playlist-musica-erro" : undefined}
            className={erro ? "input-erro" : undefined}
            onChange={(evento) => {
              setNome(evento.target.value);
              setErro("");
            }}
          />
          {erro && (
            <p className="mensagem-erro" id="nova-playlist-musica-erro" role="alert">
              {erro}
            </p>
          )}
        </div>
        <div className="dialogo-acoes">
          <button type="button" className="botao botao-borda" onClick={fechar}>
            Cancelar
          </button>
          <button type="submit" className="botao botao-azul">
            Criar e adicionar
          </button>
        </div>
      </form>
    </Dialogo>
  );
}
