import { calcularForca } from "../servicos/senha.js";

const NOMES = ["", "Fraca", "Razoável", "Boa", "Forte"];

export default function IndicadorForca({ senha }) {
  const nivel = senha === "" ? 0 : calcularForca(senha);
  const texto = nivel === 0 ? "Use letras e números." : "Força da senha: " + NOMES[nivel];

  return (
    <div className="forca" data-nivel={nivel}>
      <div className="forca-barras" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <p className="forca-texto" id="forca-texto" aria-live="polite">
        {texto}
      </p>
    </div>
  );
}
