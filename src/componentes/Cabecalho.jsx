import { Link, NavLink } from "react-router-dom";
import BotaoTema from "./BotaoTema.jsx";
import Icone from "./Icone.jsx";
import { useAuth } from "../contextos/AuthContext.jsx";

const LIGACOES = [
  { para: "/inicio", rotulo: "Início", icone: "inicio" },
  { para: "/buscar", rotulo: "Buscar", icone: "buscar" },
  { para: "/biblioteca", rotulo: "Biblioteca", icone: "biblioteca" }
];

export default function Cabecalho() {
  const { usuario, sair } = useAuth();

  return (
    <header className="cabecalho">
      <div className="cabecalho-interno">
        <Link to="/inicio" className="marca-topo" aria-label="Wave, ir para o início">
          <img src="/img/wave-logo-pequeno.webp" width="92" height="59" alt="" />
          <span className="marca-nome">Wave</span>
        </Link>
        <nav className="navegacao" aria-label="Principal">
          <ul>
            {LIGACOES.map((item) => (
              <li key={item.para}>
                <NavLink to={item.para} className="navegacao-link">
                  <Icone nome={item.icone} tamanho={20} />
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="cabecalho-acoes">
          <BotaoTema />
          <Link to="/configuracoes" className="botao-icone botao-contorno" aria-label={"Ajustes de " + usuario.nome}>
            <Icone nome="usuario" />
          </Link>
          {usuario.visitante && (
            <Link to="/cadastro" className="botao botao-azul botao-criar">
              Criar conta
            </Link>
          )}
          <button type="button" className="botao botao-borda botao-sair" onClick={sair}>
            {usuario.visitante ? "Sair do modo visitante" : "Sair da conta"}
          </button>
        </div>
      </div>
    </header>
  );
}

export function NavegacaoInferior() {
  return (
    <nav className="navegacao-inferior" aria-label="Navegação do aplicativo">
      <ul>
        {LIGACOES.map((item) => (
          <li key={item.para}>
            <NavLink to={item.para} className="navegacao-inferior-link">
              <Icone nome={item.icone} />
              <span>{item.rotulo}</span>
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink to="/configuracoes" className="navegacao-inferior-link">
            <Icone nome="config" />
            <span>Ajustes</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
