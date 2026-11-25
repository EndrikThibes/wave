import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icone from "../componentes/Icone.jsx";
import ListaFaixas from "../componentes/ListaFaixas.jsx";
import { CartaoArtista, CartaoFaixa } from "../componentes/Cartoes.jsx";
import { buscarArtistas, buscarFaixas } from "../dados/catalogo.js";
import { GENEROS } from "../dados/generos.js";
import { useTitulo } from "../servicos/useTitulo.js";

export default function Buscar() {
  useTitulo("Buscar");
  const [parametros, setParametros] = useSearchParams();
  const [termo, setTermo] = useState(parametros.get("q") || "");
  const genero = parametros.get("genero") || "";
  const tipo = parametros.get("tipo") || "tudo";

  function atualizar(novoTermo, novoGenero, novoTipo = tipo) {
    const proximo = {};
    if (novoTipo !== "tudo") {
      proximo.tipo = novoTipo;
    }
    if (novoTermo.trim() !== "") {
      proximo.q = novoTermo;
    }
    if (novoGenero !== "") {
      proximo.genero = novoGenero;
    }
    setParametros(proximo, { replace: true });
  }

  function mudarTermo(valor) {
    setTermo(valor);
    atualizar(valor, genero);
  }

  function escolherGenero(nome) {
    atualizar(termo, nome === genero ? "" : nome);
  }

  const faixas = tipo === "artistas" ? [] : buscarFaixas(termo, genero);
  const artistas = tipo === "musicas" ? [] : buscarArtistas(termo, genero);
  const temTermo = termo.trim() !== "";
  const melhor = temTermo && tipo === "tudo" ? (artistas.length > 0 ? { artista: artistas[0] } : faixas.length > 0 ? { faixa: faixas[0] } : null) : null;
  const semFiltro = termo.trim() === "" && genero === "";

  return (
    <>
      <h1 className="titulo-pagina">Buscar</h1>

      <form className="busca" role="search" onSubmit={(evento) => evento.preventDefault()}>
        <label htmlFor="campo-busca" className="so-leitor">
          Buscar músicas, artistas ou álbuns
        </label>
        <Icone nome="buscar" />
        <input
          id="campo-busca"
          type="search"
          value={termo}
          placeholder="Músicas, artistas ou álbuns"
          autoComplete="off"
          onChange={(evento) => mudarTermo(evento.target.value)}
        />
      </form>

      <div className="filtros" role="group" aria-label="Mostrar">
        {[
          ["tudo", "Tudo"],
          ["musicas", "Músicas"],
          ["artistas", "Artistas"]
        ].map(([valor, rotulo]) => (
          <button
            key={valor}
            type="button"
            className="filtro filtro-tipo"
            aria-pressed={tipo === valor}
            onClick={() => atualizar(termo, genero, valor)}
          >
            {rotulo}
          </button>
        ))}
      </div>

      <div className="filtros" role="group" aria-label="Filtrar por gênero">
        {GENEROS.map((item) => (
          <button
            key={item.nome}
            type="button"
            className="filtro"
            aria-pressed={genero === item.nome}
            style={{ "--cor": item.cor }}
            onClick={() => escolherGenero(item.nome)}
          >
            <Icone nome={item.nome} tamanho={18} />
            {item.nome}
          </button>
        ))}
      </div>

      <p className="so-leitor" role="status" aria-live="polite">
        {faixas.length} músicas e {artistas.length} artistas encontrados.
      </p>

      {faixas.length === 0 && artistas.length === 0 ? (
        <div className="vazio">
          <Icone nome="buscar" tamanho={40} />
          <h2>Nada encontrado</h2>
          <p>Não achamos resultados para “{termo}”. Confira a escrita ou escolha outro gênero.</p>
          <button
            type="button"
            className="botao botao-borda"
            onClick={() => {
              setTermo("");
              setParametros({}, { replace: true });
            }}
          >
            Limpar a busca
          </button>
        </div>
      ) : (
        <>
          {melhor !== null && (
            <section className="secao" aria-labelledby="titulo-melhor">
              <h2 id="titulo-melhor">Melhor resultado</h2>
              <div className="melhor">
                {melhor.artista ? <CartaoArtista artista={melhor.artista} /> : <CartaoFaixa faixa={melhor.faixa} lista={faixas.map((f) => f.id)} />}
              </div>
            </section>
          )}
          {artistas.filter((artista) => !melhor || melhor.artista !== artista).length > 0 && (
            <section className="secao" aria-labelledby="titulo-artistas-busca">
              <h2 id="titulo-artistas-busca">{semFiltro ? "Todos os artistas" : "Artistas"}</h2>
              <ul className="grade">
                {artistas.filter((artista) => !melhor || melhor.artista !== artista).map((artista) => (
                  <li key={artista.id}>
                    <CartaoArtista artista={artista} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {faixas.length > 0 && (
            <section className="secao" aria-labelledby="titulo-musicas-busca">
              <h2 id="titulo-musicas-busca">Músicas</h2>
              <ListaFaixas ids={faixas.map((f) => f.id)} rotuloLista="Resultados da busca" />
            </section>
          )}
        </>
      )}
    </>
  );
}
