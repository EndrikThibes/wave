import { useState } from "react";
import Dialogo from "./Dialogo.jsx";
import Icone from "./Icone.jsx";
import Imagem from "./Imagem.jsx";
import CamposPlaylist from "./CamposPlaylist.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { useAviso } from "../contextos/AvisoContext.jsx";
import { faixaPorId, imagemDaCapa } from "../dados/catalogo.js";

export default function AdicionarNaPlaylist({ faixaId, aberto, aoFechar }) {
  const biblioteca = useBiblioteca();
  const { mostrar } = useAviso();
  const [criando, setCriando] = useState(biblioteca.playlists.length === 0);
  const [nome, setNome] = useState("");
  const [publica, setPublica] = useState(false);
  const [erro, setErro] = useState("");

  const faixa = faixaPorId(faixaId);

  function alternar(playlist) {
    if (playlist.faixas.includes(faixaId)) {
      biblioteca.removerDaPlaylist(playlist.id, faixaId);
      mostrar("Removida de " + playlist.nome + ".");
    } else {
      biblioteca.adicionarNaPlaylist(playlist.id, faixaId);
      mostrar("Adicionada a " + playlist.nome + ".");
    }
  }

  function criar(evento) {
    evento.preventDefault();
    const resultado = biblioteca.criarPlaylist(nome, faixaId, publica);
    if (resultado.erro !== "") {
      setErro(resultado.erro);
      document.getElementById("nova-playlist-nome").focus();
      return;
    }
    mostrar("Playlist " + resultado.playlist.nome + " criada com a música.");
    aoFechar();
  }

  return (
    <Dialogo aberto={aberto} aoFechar={aoFechar} titulo="Salvar na playlist">
      <div className="dialogo-faixa">
        <Imagem src={imagemDaCapa(faixa, 120)} largura={48} altura={48} className="faixa-capa" nome={faixa.titulo} />
        <p className="dialogo-texto">{faixa.titulo}</p>
      </div>

      {biblioteca.playlists.length > 0 && (
        <fieldset className="grupo">
          <legend className="so-leitor">Suas playlists</legend>
          <ul className="lista-escolha">
            {biblioteca.playlists.map((playlist) => (
              <li key={playlist.id}>
                <label className="escolha-playlist">
                  <input
                    type="checkbox"
                    checked={playlist.faixas.includes(faixaId)}
                    onChange={() => alternar(playlist)}
                  />
                  <span className="escolha-textos">
                    <span className="escolha-nome">{playlist.nome}</span>
                    <span className="dica">
                      {playlist.publica ? "Pública" : "Privada"} · {playlist.faixas.length} músicas
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      {criando ? (
        <form className="formulario" onSubmit={criar} noValidate>
          <CamposPlaylist
            idBase="nova-playlist"
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
            <button type="button" className="botao botao-borda" onClick={aoFechar}>
              Cancelar
            </button>
            <button type="submit" className="botao botao-azul">
              Criar playlist
            </button>
          </div>
        </form>
      ) : (
        <div className="dialogo-acoes">
          <button type="button" className="botao botao-borda" onClick={() => setCriando(true)}>
            <Icone nome="mais" tamanho={18} />
            Nova playlist
          </button>
          <button type="button" className="botao botao-azul" onClick={aoFechar}>
            Concluir
          </button>
        </div>
      )}
    </Dialogo>
  );
}
