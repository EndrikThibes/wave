import { Link } from "react-router-dom";
import Icone from "../componentes/Icone.jsx";
import Imagem from "../componentes/Imagem.jsx";
import { useAuth } from "../contextos/AuthContext.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { faixaPorId, imagemDaCapa } from "../dados/catalogo.js";
import { planoPorId } from "../dados/planos.js";
import { useTitulo } from "../servicos/useTitulo.js";

export default function Perfil() {
  useTitulo("Perfil");
  const { usuario } = useAuth();
  const biblioteca = useBiblioteca();
  const plano = planoPorId(usuario.plano);
  const publicas = biblioteca.playlists.filter((p) => p.publica).length;
  const total = biblioteca.playlists.length;

  return (
    <>
      <header className="perfil-topo">
        <div className="avatar" aria-hidden="true">
          <Icone nome="usuario" tamanho={64} />
        </div>
        <div className="perfil-textos">
          <p className="rotulo">Perfil</p>
          <h1 className="titulo-pagina perfil-nome">{usuario.nome}</h1>
          <p className="perfil-numeros">
            {total} {total === 1 ? "playlist" : "playlists"} · {publicas} {publicas === 1 ? "pública" : "públicas"} ·{" "}
            {biblioteca.curtidas.length} curtidas
          </p>
          <p className="selo-plano">Plano {plano.nome}</p>
        </div>
        <Link to="/configuracoes" className="botao botao-borda perfil-config">
          <Icone nome="config" tamanho={18} />
          Configurações
        </Link>
      </header>

      <section className="secao" aria-labelledby="titulo-playlists-perfil">
        <h2 id="titulo-playlists-perfil">Playlists</h2>
        {total === 0 ? (
          <div className="vazio">
            <Icone nome="fila" tamanho={40} />
            <h3>Nenhuma playlist criada ainda</h3>
            <p>As playlists que você criar aparecem aqui.</p>
            <Link to="/biblioteca" className="botao botao-azul">
              Criar playlist
            </Link>
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
    </>
  );
}
