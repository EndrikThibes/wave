import { Link, useParams } from "react-router-dom";
import Icone from "../componentes/Icone.jsx";
import Imagem from "../componentes/Imagem.jsx";
import ListaFaixas from "../componentes/ListaFaixas.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { albumPorId, artistaPorId, faixasDoAlbum, imagemDaCapa } from "../dados/catalogo.js";
import { formatarTempo } from "../servicos/youtube.js";
import { useTitulo } from "../servicos/useTitulo.js";
import NaoEncontrada from "./NaoEncontrada.jsx";

export default function Album() {
  const { id } = useParams();
  const album = albumPorId(id);
  const player = usePlayer();
  useTitulo(album ? album.titulo : "Álbum não encontrado");

  if (!album) {
    return <NaoEncontrada dentro />;
  }
  const artista = artistaPorId(album.artistaId);
  const faixas = faixasDoAlbum(album.id);
  const ids = faixas.map((f) => f.id);
  const total = faixas.reduce((soma, f) => soma + f.duracao, 0);

  return (
    <>
      <header className="album-topo">
        <Imagem src={imagemDaCapa(album, 600)} largura={220} altura={220} className="album-capa" nome={album.titulo} />
        <div>
          <p className="rotulo">{album.tipo || "Álbum"}</p>
          <h1 className="titulo-pagina">{album.titulo}</h1>
          <p className="dica">
            <Link to={"/artista/" + artista.id}>{artista.nome}</Link>
            {album.ano && " · " + album.ano} · {faixas.length} {faixas.length === 1 ? "música" : "músicas"} ·{" "}
            {formatarTempo(total)}
          </p>
          <button type="button" className="botao botao-azul" onClick={() => player.tocarLista(ids, ids[0])}>
            <Icone nome="play" tamanho={20} />
            Tocar álbum
          </button>
        </div>
      </header>
      <section className="secao" aria-labelledby="titulo-faixas-album">
        <h2 id="titulo-faixas-album">Músicas</h2>
        <ListaFaixas ids={ids} rotuloLista={"Músicas de " + album.titulo} />
      </section>
    </>
  );
}
