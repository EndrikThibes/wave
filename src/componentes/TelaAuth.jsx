import { Link } from "react-router-dom";
import BotaoTema from "./BotaoTema.jsx";

const ONDA_A = "M0 80 C 150 20, 300 140, 450 80 S 750 20, 900 80 S 1050 140, 1200 80 V190 H0Z";

export default function TelaAuth({ ligacaoTopo, children }) {
  return (
    <div className="tela-auth">
      <a className="pular-menu" href="#principal">
        Pular para o formulário
      </a>
      <aside className="painel-marca" aria-label="Apresentação do Wave">
        <Link className="marca-topo" to="/login" aria-label="Wave, ir para o início">
          <img src={import.meta.env.BASE_URL + "img/wave-logo-pequeno.webp"} width="92" height="59" alt="" />
          Wave
        </Link>
        <div className="marca-texto">
          <img className="logo-grande" src={import.meta.env.BASE_URL + "img/wave-logo.webp"} width="365" height="233" alt="" />
          <p className="slogan">
            Sua música, em <em>ondas</em>.
          </p>
          <p className="frase">Descubra, ouça e organize tudo num só lugar, sem ruído e sem distração.</p>
        </div>
        <p className="rodape-marca">© 2026 Wave · Projeto acadêmico de DIU · UDESC Alto Vale</p>
        <div className="ondas" aria-hidden="true">
          <svg viewBox="0 0 1200 190" preserveAspectRatio="none">
            <path d={ONDA_A} fill="#2459ee" />
          </svg>
          <svg viewBox="0 0 1200 190" preserveAspectRatio="none">
            <path d={ONDA_A} fill="#1b2fbf" />
          </svg>
          <svg viewBox="0 0 1200 190" preserveAspectRatio="none">
            <path d={ONDA_A} fill="#22d3ff" />
          </svg>
        </div>
      </aside>
      <div className="painel-form">
        <div className="topo-auth">
          {ligacaoTopo}
          <BotaoTema />
        </div>
        <main id="principal" className="principal-auth">
          {children}
        </main>
        <footer className="rodape-auth">
          <Link to="/privacidade">Termos e privacidade</Link>
        </footer>
      </div>
    </div>
  );
}
