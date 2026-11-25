import { Link } from "react-router-dom";
import Icone from "../componentes/Icone.jsx";
import { CartaoArtista, CartaoFaixa, CartaoOnda } from "../componentes/Cartoes.jsx";
import { useAuth } from "../contextos/AuthContext.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { ARTISTAS, FAIXAS, embaralhar, faixaPorId, faixasDosGeneros } from "../dados/catalogo.js";
import { ONDAS } from "../dados/generos.js";
import { useTitulo } from "../servicos/useTitulo.js";

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) {
    return "Bom dia";
  }
  if (hora < 18) {
    return "Boa tarde";
  }
  return "Boa noite";
}

export default function Inicio() {
  useTitulo("Início");
  const { usuario } = useAuth();
  const biblioteca = useBiblioteca();
  const player = usePlayer();

  const hoje = new Date();
  const semente = hoje.getFullYear() * 400 + hoje.getMonth() * 32 + hoje.getDate();
  const temGeneros = usuario.generos && usuario.generos.length > 0;
  const generos = temGeneros ? usuario.generos : [];
  const base = temGeneros ? faixasDosGeneros(generos) : FAIXAS;
  const idsSuaOnda = embaralhar(base, semente).slice(0, 12).map((f) => f.id);
  const recentes = biblioteca.historico.slice(0, 6).map(faixaPorId);
  const idsRecentes = biblioteca.historico.slice(0, 6);
  const artistas = temGeneros ? ARTISTAS.filter((a) => a.generos.some((g) => generos.includes(g))) : ARTISTAS;
  const artistasMostrados = (artistas.length >= 4 ? artistas : ARTISTAS).slice(0, 6);

  function tocarOnda(onda) {
    const ids = embaralhar(
      FAIXAS.filter((f) => onda.generos.includes(f.genero)),
      semente
    ).map((f) => f.id);
    player.tocarLista(ids, ids[0]);
  }

  return (
    <>
      <h1 className="titulo-pagina">
        {saudacao()}, {usuario.nome}
      </h1>

      <section className="destaque" aria-labelledby="titulo-sua-onda">
        <div className="destaque-texto">
          <p className="rotulo">Feita para você</p>
          <h2 id="titulo-sua-onda">Sua onda</h2>
          <p className="destaque-desc">
            {temGeneros
              ? "Uma mistura de " + generos.join(", ") + ", renovada todo dia."
              : "Uma mistura de tudo que tem no Wave, renovada todo dia."}
          </p>
          <button type="button" className="botao botao-azul" onClick={() => player.tocarLista(idsSuaOnda, idsSuaOnda[0])}>
            <Icone nome="play" tamanho={20} />
            Tocar minha onda
          </button>
        </div>
        <div className="destaque-capas" aria-hidden="true">
          {idsSuaOnda.slice(0, 3).map((id) => (
            <img
              key={id}
              src={faixaPorId(id).capa + "/200x200bb.jpg"}
              width="96"
              height="96"
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </section>

      <section className="secao" aria-labelledby="titulo-ondas">
        <h2 id="titulo-ondas">Escolha uma onda</h2>
        <ul className="grade grade-ondas">
          {ONDAS.map((onda) => (
            <li key={onda.id}>
              <CartaoOnda onda={onda} aoTocar={tocarOnda} />
            </li>
          ))}
        </ul>
      </section>

      {recentes.length > 0 && (
        <section className="secao" aria-labelledby="titulo-recentes">
          <h2 id="titulo-recentes">Tocadas por último</h2>
          <ul className="grade">
            {recentes.map((faixa) => (
              <li key={faixa.id}>
                <CartaoFaixa faixa={faixa} lista={idsRecentes} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="secao" aria-labelledby="titulo-artistas">
        <div className="secao-topo">
          <h2 id="titulo-artistas">{temGeneros ? "Artistas dos seus gêneros" : "Artistas no Wave"}</h2>
          <Link to="/buscar">Ver todos os artistas</Link>
        </div>
        <ul className="grade">
          {artistasMostrados.map((artista) => (
            <li key={artista.id}>
              <CartaoArtista artista={artista} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
