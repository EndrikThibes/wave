import Imagem from "./Imagem.jsx";
import Icone from "./Icone.jsx";
import BotaoCurtir from "./BotaoCurtir.jsx";
import { Progresso, Transporte } from "./ControlesPlayer.jsx";
import { usePlayer, ID_ALVO_VIDEO } from "../contextos/PlayerContext.jsx";
import { artistaPorId, faixaPorId, imagemDaCapa } from "../dados/catalogo.js";
import { useLargo } from "../servicos/useLargo.js";

export default function PainelPlayer() {
  const player = usePlayer();
  const largo = useLargo();
  const faixa = player.faixaAtual;
  const ativo = faixa !== null;
  const visivel = ativo && (largo || player.painelAberto);
  const artista = ativo ? artistaPorId(faixa.artistaId) : null;
  const classe = "painel-player" + (ativo ? " ativo" : "") + (visivel ? " visivel" : "");

  return (
    <aside className={classe} aria-label="Tocando agora" inert={!visivel}>
      <div className="painel-topo">
        <h2 className="painel-titulo">Tocando agora</h2>
        {!largo && (
          <button
            type="button"
            className="botao-icone botao-contorno"
            aria-label="Recolher o player"
            onClick={() => player.setPainelAberto(false)}
          >
            <Icone nome="baixo" />
          </button>
        )}
      </div>

      <div className="video-quadro">
        <div id={ID_ALVO_VIDEO} />
      </div>

      {ativo && (
        <>
          <div className="painel-info">
            <div className="painel-textos">
              <p className="painel-musica">{faixa.titulo}</p>
              <p className="painel-artista">{artista.nome}</p>
              <p className="dica">{faixa.album}</p>
            </div>
            <BotaoCurtir faixaId={faixa.id} />
          </div>

          {!largo && (
            <div className="painel-controles">
              <Progresso />
              <Transporte />
            </div>
          )}

          <h3 className="painel-fila-titulo">Fila ({player.fila.length})</h3>
          <ol className="painel-fila">
            {player.fila.map((id, posicao) => {
              const item = faixaPorId(id);
              const atual = posicao === player.indice;
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={"fila-item" + (atual ? " atual" : "")}
                    aria-current={atual ? "true" : undefined}
                    onClick={() => player.irParaIndice(posicao)}
                  >
                    <Imagem src={imagemDaCapa(item, 120)} largura={40} altura={40} className="fila-capa" nome={item.titulo} />
                    <span className="fila-textos">
                      <span className="fila-titulo">{item.titulo}</span>
                      <span className="fila-artista">{artistaPorId(item.artistaId).nome}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="painel-fim">
            <button type="button" className="botao botao-borda botao-cheio" onClick={player.fecharPlayer}>
              Fechar o player
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
