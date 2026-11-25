import { Link, useParams } from "react-router-dom";
import Icone from "../componentes/Icone.jsx";
import Imagem from "../componentes/Imagem.jsx";
import ListaFaixas from "../componentes/ListaFaixas.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { albunsDoArtista, artistaPorId, faixasDoArtista } from "../dados/catalogo.js";
import { CartaoAlbum } from "../componentes/Cartoes.jsx";
import { useTitulo } from "../servicos/useTitulo.js";
import NaoEncontrada from "./NaoEncontrada.jsx";

export default function Artista() {
  const { id } = useParams();
  const artista = artistaPorId(id);
  const player = usePlayer();
  useTitulo(artista ? artista.nome : "Artista não encontrado");

  if (!artista) {
    return <NaoEncontrada dentro />;
  }
  const ids = faixasDoArtista(artista.id).map((f) => f.id);

  return (
    <>
      <p>
        <Link to="/buscar" className="voltar">
          <Icone nome="voltar" tamanho={18} />
          Voltar para a busca
        </Link>
      </p>
      <header className="artista-topo">
        <Imagem src={artista.foto} posicao={artista.posicao} largura={200} altura={200} className="artista-foto" nome={artista.nome} />
        <div>
          <p className="rotulo">Artista</p>
          <h1 className="titulo-pagina">{artista.nome}</h1>
          <p className="artista-bio">{artista.bio}</p>
          <p className="dica">
            {artista.generos.join(" · ")}
          </p>
          <button type="button" className="botao botao-azul" onClick={() => player.tocarLista(ids, ids[0])}>
            <Icone nome="play" tamanho={20} />
            Tocar músicas de {artista.nome}
          </button>
        </div>
      </header>
      <section className="secao" aria-labelledby="titulo-populares">
        <h2 id="titulo-populares">Músicas</h2>
        <ListaFaixas ids={ids} rotuloLista={"Músicas de " + artista.nome} />
      </section>
      <section className="secao" aria-labelledby="titulo-albuns">
        <h2 id="titulo-albuns">Álbuns</h2>
        <ul className="grade">
          {albunsDoArtista(artista.id).map((album) => (
            <li key={album.id}>
              <CartaoAlbum album={album} mostrarArtista={false} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
