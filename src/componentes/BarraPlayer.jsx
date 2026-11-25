import { Link } from "react-router-dom";
import Imagem from "./Imagem.jsx";
import Icone from "./Icone.jsx";
import BotaoCurtir from "./BotaoCurtir.jsx";
import { Progresso, Transporte, Volume } from "./ControlesPlayer.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { artistaPorId, imagemDaCapa } from "../dados/catalogo.js";
import { useLargo } from "../servicos/useLargo.js";

export default function BarraPlayer() {
  const player = usePlayer();
  const largo = useLargo();
  const faixa = player.faixaAtual;

  if (faixa === null) {
    return null;
  }
  const artista = artistaPorId(faixa.artistaId);
  const porcentagem = player.duracao > 0 ? Math.min(100, (player.progresso / player.duracao) * 100) : 0;

  const identificacao = (
    <>
      <Imagem src={imagemDaCapa(faixa, 120)} largura={56} altura={56} className="barra-capa" nome={faixa.titulo} />
      <span className="barra-textos">
        <span className="barra-titulo">
          {!largo && <span className="so-leitor">Abrir player: </span>}
          {faixa.titulo}
        </span>
        <span className="barra-artista">{artista.nome}</span>
      </span>
    </>
  );

  return (
    <section className="barra-player" aria-label="Player de música">
      {largo ? (
        <div className="barra-faixa">{identificacao}</div>
      ) : (
        <button
          type="button"
          className="barra-faixa barra-faixa-botao"
          onClick={() => player.setPainelAberto(true)}
        >
          {identificacao}
        </button>
      )}
      <BotaoCurtir faixaId={faixa.id} />

      {largo ? (
        <div className="barra-centro">
          <Transporte />
          <Progresso />
        </div>
      ) : (
        <button
          type="button"
          className="botao-icone botao-tocar"
          aria-label={player.tocando ? "Pausar" : "Tocar"}
          onClick={player.alternar}
        >
          <Icone nome={player.tocando ? "pause" : "play"} tamanho={26} />
        </button>
      )}

      {largo && (
        <div className="barra-extras">
          <Volume />
          <button type="button" className="botao-icone" aria-label="Fechar o player" onClick={player.fecharPlayer}>
            <Icone nome="fechar" />
          </button>
        </div>
      )}
      {!largo && <span className="barra-linha" style={{ width: porcentagem + "%" }} aria-hidden="true" />}
    </section>
  );
}

export function LigacaoArtista({ artistaId }) {
  const artista = artistaPorId(artistaId);
  return <Link to={"/artista/" + artista.id}>{artista.nome}</Link>;
}
