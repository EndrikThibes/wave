import Icone from "./Icone.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { useAviso } from "../contextos/AvisoContext.jsx";
import { faixaPorId } from "../dados/catalogo.js";

export default function BotaoCurtir({ faixaId }) {
  const biblioteca = useBiblioteca();
  const { mostrar } = useAviso();
  const curtida = biblioteca.estaCurtida(faixaId);
  const titulo = faixaPorId(faixaId).titulo;

  function clicar() {
    const agora = biblioteca.alternarCurtida(faixaId);
    mostrar(agora ? "“" + titulo + "” foi para Músicas curtidas." : "Removida de Músicas curtidas.");
  }

  return (
    <button
      type="button"
      className="botao-icone botao-curtir"
      aria-pressed={curtida}
      aria-label={"Curtir " + titulo}
      onClick={clicar}
    >
      <Icone nome="coracao" preenchido={curtida} />
    </button>
  );
}
