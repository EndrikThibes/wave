import { useState } from "react";
import Icone from "./Icone.jsx";
import AdicionarNaPlaylist from "./AdicionarNaPlaylist.jsx";
import { faixaPorId } from "../dados/catalogo.js";

export default function BotaoAdicionar({ faixaId }) {
  const [aberto, setAberto] = useState(false);
  const titulo = faixaPorId(faixaId).titulo;

  return (
    <>
      <button
        type="button"
        className="botao-icone"
        aria-label={"Adicionar " + titulo + " a uma playlist"}
        onClick={() => setAberto(true)}
      >
        <Icone nome="mais" />
      </button>
      {aberto && <AdicionarNaPlaylist faixaId={faixaId} aberto={aberto} aoFechar={() => setAberto(false)} />}
    </>
  );
}
