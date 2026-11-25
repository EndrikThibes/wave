import { useState } from "react";
import { Link } from "react-router-dom";
import Dialogo from "../componentes/Dialogo.jsx";
import CamposPlaylist from "../componentes/CamposPlaylist.jsx";
import Icone from "../componentes/Icone.jsx";
import Imagem from "../componentes/Imagem.jsx";
import ListaFaixas from "../componentes/ListaFaixas.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { useAviso } from "../contextos/AvisoContext.jsx";
import { faixaPorId, imagemDaCapa } from "../dados/catalogo.js";
import { useTitulo } from "../servicos/useTitulo.js";

export default function Biblioteca() {
  useTitulo("Biblioteca");
  const biblioteca = useBiblioteca();
  const { mostrar } = useAviso();
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [publica, setPublica] = useState(false);
  const [erro, setErro] = useState("");

  const maisTocadas = Object.keys(biblioteca.reproducoes)
    .filter((id) => faixaPorId(id))
    .sort((a, b) => biblioteca.reproducoes[b] - biblioteca.reproducoes[a])
    .slice(0, 5);

  function limparHistorico() {
    biblioteca.limparHistorico();
    mostrar("Histórico apagado.");
  }

  function fechar() {
    setCriando(false);
    setNome("");
    setPublica(false);
    setErro("");
  }

  function criar(evento) {
    evento.preventDefault();
    const resultado = biblioteca.criarPlaylist(nome, null, publica);
    if (resultado.erro !== "") {
      setErro(resultado.erro);
      document.getElementById("criar-playlist-nome").focus();
      return;
    }
    mostrar("Playlist " + resultado.playlist.nome + " criada.");
    fechar();
  }

  return (
    <>
      <div className="secao-topo">
        <h1 className="titulo-pagina">Biblioteca</h1>
        <button type="button" className="botao botao-azul" onClick={() => setCriando(true)}>
          <Icone nome="mais" tamanho={20} />
          Criar playlist
        </button>
      </div>

      <section className="secao" aria-labelledby="titulo-playlists">
        <h2 id="titulo-playlists">Suas playlists</h2>
        {biblioteca.playlists.length === 0 ? (
          <div className="vazio">
            <Icone nome="fila" tamanho={40} />
            <h3>Você ainda não tem playlists</h3>
            <p>Crie uma playlist e adicione suas músicas favoritas com o botão +.</p>
            <button type="button" className="botao botao-azul" onClick={() => setCriando(true)}>
              Criar minha primeira playlist
            </button>
          </div>
        ) : (
          <ul className="grade">
            {biblioteca.playlists.map((playlist) => {
              const primeira = playlist.faixas.length > 0 ? faixaPorId(playlist.faixas[0]) : null;
              return (
                <li key={playlist.id}>
                  <Link to={"/playlist/" + playlist.id} className="cartao">
                    <Imagem
                      src={primeira ? imagemDaCapa(primeira, 300) : ""}
                      largura={200}
                      altura={200}
                      className="cartao-foto"
                      nome={playlist.nome}
                    />
                    <span className="cartao-titulo">{playlist.nome}</span>
                    <span className="cartao-sub">
                      {playlist.publica ? "Pública" : "Privada"} · {playlist.faixas.length} músicas
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="secao" aria-labelledby="titulo-curtidas">
        <h2 id="titulo-curtidas">Músicas curtidas</h2>
        {biblioteca.curtidas.length === 0 ? (
          <div className="vazio">
            <Icone nome="coracao" tamanho={40} />
            <h3>Nenhuma música curtida ainda</h3>
            <p>Toque no coração de uma música para guardá-la aqui.</p>
            <Link to="/buscar" className="botao botao-borda">
              Buscar músicas
            </Link>
          </div>
        ) : (
          <ListaFaixas ids={biblioteca.curtidas} rotuloLista="Músicas curtidas" />
        )}
      </section>

      {maisTocadas.length > 0 && (
        <section className="secao" aria-labelledby="titulo-mais-tocadas">
          <h2 id="titulo-mais-tocadas">Mais tocadas por você</h2>
          <ListaFaixas
            ids={maisTocadas}
            rotuloLista="Músicas mais tocadas por você"
            acaoExtra={(id) => (
              <span className="contagem">
                {biblioteca.reproducoes[id]} {biblioteca.reproducoes[id] === 1 ? "vez" : "vezes"}
              </span>
            )}
          />
        </section>
      )}

      {biblioteca.historico.length > 0 && (
        <section className="secao" aria-labelledby="titulo-historico">
          <div className="secao-topo">
            <h2 id="titulo-historico">Ouvidas recentemente</h2>
            <button type="button" className="botao botao-borda" onClick={limparHistorico}>
              Apagar histórico
            </button>
          </div>
          <ListaFaixas ids={biblioteca.historico} rotuloLista="Músicas ouvidas recentemente" />
        </section>
      )}

      <Dialogo aberto={criando} aoFechar={fechar} titulo="Criar playlist">
        <form className="formulario" onSubmit={criar} noValidate>
          <CamposPlaylist
            idBase="criar-playlist"
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
            <button type="button" className="botao botao-borda" onClick={fechar}>
              Cancelar
            </button>
            <button type="submit" className="botao botao-azul">
              Criar playlist
            </button>
          </div>
        </form>
      </Dialogo>
    </>
  );
}
