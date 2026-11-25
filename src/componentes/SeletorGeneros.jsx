import { GENEROS } from "../dados/generos.js";
import Icone from "./Icone.jsx";

export default function SeletorGeneros({ escolhidos, aoAlternar }) {
  return (
    <div className="generos" role="group" aria-label="Gêneros musicais">
      {GENEROS.map((genero) => {
        const marcado = escolhidos.includes(genero.nome);
        return (
          <button
            key={genero.nome}
            type="button"
            className="genero"
            style={{ "--cor": genero.cor }}
            aria-pressed={marcado}
            onClick={() => aoAlternar(genero.nome)}
          >
            <Icone nome={genero.nome} tamanho={26} />
            {genero.nome}
            <span className="genero-marca" aria-hidden="true">
              <Icone nome="check" tamanho={14} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
