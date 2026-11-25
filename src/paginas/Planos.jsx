import { useNavigate } from "react-router-dom";
import Icone from "../componentes/Icone.jsx";
import { useAuth } from "../contextos/AuthContext.jsx";
import { PLANOS, formatarPreco } from "../dados/planos.js";
import { useTitulo } from "../servicos/useTitulo.js";

export default function Planos() {
  useTitulo("Planos");
  const { usuario, editarPerfil } = useAuth();
  const navegar = useNavigate();
  const atual = usuario.plano || "gratis";

  function escolher(plano) {
    editarPerfil({ plano: plano.id });
    navegar("/planos/ativado", { state: { plano: plano.id } });
  }

  return (
    <>
      <div className="planos-topo">
        <h1 className="titulo-pagina">Escolha seu plano</h1>
        <p className="destaque-desc">Os mesmos planos que você já conhece, por um preço menor. Cancele quando quiser.</p>
      </div>
      <ul className="grade-planos">
        {PLANOS.map((plano) => {
          const eAtual = plano.id === atual;
          return (
            <li key={plano.id}>
              <article className={"plano" + (eAtual ? " plano-atual" : "")} aria-labelledby={"plano-" + plano.id}>
                <p className="rotulo">{plano.destaque}</p>
                <h2 id={"plano-" + plano.id}>{plano.nome}</h2>
                <p className="plano-preco">
                  {formatarPreco(plano.preco)}
                  {plano.preco > 0 && <span className="dica"> por mês</span>}
                </p>
                <p className="dica">{plano.contas}</p>
                <ul className="plano-recursos">
                  {plano.recursos.map((recurso) => (
                    <li key={recurso}>
                      <Icone nome="check" tamanho={18} />
                      {recurso}
                    </li>
                  ))}
                </ul>
                {eAtual ? (
                  <p className="plano-ativo">Seu plano atual</p>
                ) : (
                  <button type="button" className="botao botao-azul botao-cheio" onClick={() => escolher(plano)}>
                    {plano.preco === 0 ? "Voltar para o Grátis" : "Assinar " + plano.nome}
                  </button>
                )}
              </article>
            </li>
          );
        })}
      </ul>
      <p className="dica">Projeto acadêmico: nenhum pagamento é cobrado ao trocar de plano.</p>
    </>
  );
}
