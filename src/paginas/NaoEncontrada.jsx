import { Link } from "react-router-dom";
import { useTitulo } from "../servicos/useTitulo.js";
import Icone from "../componentes/Icone.jsx";

export default function NaoEncontrada({ dentro }) {
  useTitulo("Página não encontrada");
  const conteudo = (
    <div className="vazio">
      <Icone nome="ondas" tamanho={40} />
      <h1>Página não encontrada</h1>
      <p>O endereço que você abriu não existe no Wave.</p>
      <Link to="/inicio" className="botao botao-azul">
        Ir para o início
      </Link>
    </div>
  );
  if (dentro) {
    return conteudo;
  }
  return (
    <main id="principal" className="documento">
      {conteudo}
    </main>
  );
}
