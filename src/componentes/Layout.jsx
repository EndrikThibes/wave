import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect, useRef } from "react";
import Carregando from "./Carregando.jsx";
import Cabecalho, { NavegacaoInferior } from "./Cabecalho.jsx";
import BarraPlayer from "./BarraPlayer.jsx";
import PainelPlayer from "./PainelPlayer.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";

export default function Layout() {
  const local = useLocation();
  const player = usePlayer();
  const principal = useRef(null);
  const primeira = useRef(true);

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    window.scrollTo(0, 0);
    if (principal.current) {
      principal.current.focus({ preventScroll: true });
    }
  }, [local.pathname]);

  return (
    <div className={"app" + (player.faixaAtual ? " com-player" : "")}>
      <a className="pular-menu" href="#principal">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <div className="corpo">
        <main id="principal" className="principal" tabIndex={-1} ref={principal}>
          <Suspense fallback={<Carregando />}>
            <Outlet />
          </Suspense>
        </main>
        <PainelPlayer />
      </div>
      <BarraPlayer />
      <NavegacaoInferior />
    </div>
  );
}
