import Icone from "./Icone.jsx";
import { useTema } from "../contextos/TemaContext.jsx";

export default function BotaoTema() {
  const { tema, alternarTema } = useTema();
  const rotulo = tema === "dark" ? "Mudar para o tema claro" : "Mudar para o tema escuro";

  return (
    <button type="button" className="botao-icone botao-contorno" aria-label={rotulo} onClick={alternarTema}>
      <span className="icone-sol">
        <Icone nome="sol" />
      </span>
      <span className="icone-lua">
        <Icone nome="lua" />
      </span>
    </button>
  );
}
