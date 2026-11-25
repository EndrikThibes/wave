import { Link } from "react-router-dom";
import Imagem from "./Imagem.jsx";
import Icone from "./Icone.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { artistaPorId, imagemDaCapa } from "../dados/catalogo.js";

export function CartaoArtista({ artista }) {
  return (
    <Link to={"/artista/" + artista.id} className="cartao cartao-artista">
      <Imagem src={artista.foto} largura={200} altura={200} className="cartao-foto" nome={artista.nome} />
      <span className="cartao-titulo">{artista.nome}</span>
      <span className="cartao-sub">{artista.generos.join(" · ")}</span>
    </Link>
  );
}

export function CartaoFaixa({ faixa, lista }) {
  const player = usePlayer();
  const artista = artistaPorId(faixa.artistaId);
  return (
    <button
      type="button"
      className="cartao cartao-faixa"
      onClick={() => player.tocarLista(lista, faixa.id)}
    >
      <span className="cartao-capa-caixa">
        <Imagem src={imagemDaCapa(faixa, 300)} largura={200} altura={200} className="cartao-foto" nome={faixa.titulo} />
        <span className="cartao-play" aria-hidden="true">
          <Icone nome="play" />
        </span>
      </span>
      <span className="cartao-titulo">
        <span className="so-leitor">Tocar </span>
        {faixa.titulo}
      </span>
      <span className="cartao-sub">{artista.nome}</span>
    </button>
  );
}

export function CartaoOnda({ onda, aoTocar }) {
  return (
    <button
      type="button"
      className="cartao-onda"
      style={{ "--cor-a": onda.cores[0], "--cor-b": onda.cores[1] }}
      onClick={() => aoTocar(onda)}
    >
      <Icone nome="ondas" tamanho={28} />
      <span className="onda-nome">
        <span className="so-leitor">Tocar a onda </span>
        {onda.nome}
      </span>
      <span className="onda-desc">{onda.descricao}</span>
    </button>
  );
}
