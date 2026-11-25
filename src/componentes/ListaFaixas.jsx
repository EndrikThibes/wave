import { Link } from "react-router-dom";
import Imagem from "./Imagem.jsx";
import Icone from "./Icone.jsx";
import BotaoCurtir from "./BotaoCurtir.jsx";
import BotaoAdicionar from "./BotaoAdicionar.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { artistaPorId, faixaPorId, imagemDaCapa } from "../dados/catalogo.js";
import { formatarTempo } from "../servicos/youtube.js";

export default function ListaFaixas({ ids, acaoExtra, rotuloLista }) {
  const player = usePlayer();

  return (
    <ol className="lista-faixas" aria-label={rotuloLista}>
      {ids.map((id, posicao) => {
        const faixa = faixaPorId(id);
        if (!faixa) {
          return null;
        }
        const artista = artistaPorId(faixa.artistaId);
        const atual = player.faixaAtual !== null && player.faixaAtual.id === id;
        return (
          <li key={id} className={"faixa" + (atual ? " faixa-atual" : "")}>
            <button
              type="button"
              className="faixa-tocar"
              onClick={() => player.tocarLista(ids, id)}
            >
              <span className="faixa-numero" aria-hidden="true">
                {atual && player.tocando ? <Icone nome="ondas" tamanho={18} /> : posicao + 1}
              </span>
              <Imagem src={imagemDaCapa(faixa, 120)} largura={48} altura={48} className="faixa-capa" nome={faixa.titulo} />
              <span className="faixa-textos">
                <span className="faixa-titulo">
                  <span className="so-leitor">Tocar </span>
                  {faixa.titulo}
                </span>
                <span className="faixa-artista">{artista.nome}</span>
              </span>
            </button>
            <Link className="faixa-album" to={"/album/" + faixa.albumId}>
              {faixa.album}
            </Link>
            <span className="faixa-acoes">
              <BotaoCurtir faixaId={id} />
              <BotaoAdicionar faixaId={id} />
              {acaoExtra && acaoExtra(id)}
            </span>
            <span className="faixa-tempo">{formatarTempo(faixa.duracao)}</span>
          </li>
        );
      })}
    </ol>
  );
}
