import { Link, Navigate, useLocation } from "react-router-dom";
import Icone from "../componentes/Icone.jsx";
import { planoPorId, formatarPreco } from "../dados/planos.js";
import { useTitulo } from "../servicos/useTitulo.js";

export default function PlanoAtivado() {
  useTitulo("Plano ativado");
  const local = useLocation();
  if (!local.state || !local.state.plano) {
    return <Navigate to="/planos" replace />;
  }
  const plano = planoPorId(local.state.plano);

  return (
    <div className="sucesso">
      <span className="sucesso-icone" aria-hidden="true">
        <Icone nome="check" tamanho={40} />
      </span>
      <h1 className="titulo-pagina">
        {plano.preco === 0 ? "Você voltou para o plano Grátis" : "Plano " + plano.nome + " ativado!"}
      </h1>
      <p className="destaque-desc">
        {plano.preco === 0
          ? "Você pode assinar um plano de novo quando quiser."
          : plano.contas + " por " + formatarPreco(plano.preco) + " por mês. Aproveite."}
      </p>
      <div className="acoes-linha">
        <Link to="/inicio" className="botao botao-azul">
          Voltar para o início
        </Link>
        <Link to="/perfil" className="botao botao-borda">
          Ver meu perfil
        </Link>
      </div>
    </div>
  );
}
