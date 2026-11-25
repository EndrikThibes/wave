import { useState } from "react";
import { Link } from "react-router-dom";
import Icone from "../componentes/Icone.jsx";
import { useAuth } from "../contextos/AuthContext.jsx";
import { useAviso } from "../contextos/AvisoContext.jsx";
import { ler, gravar } from "../servicos/armazenamento.js";
import { useTitulo } from "../servicos/useTitulo.js";

const ASSUNTOS = ["Música não toca", "Conta e login", "Planos", "Sugestão", "Outro"];

export default function Suporte() {
  useTitulo("Suporte");
  const { usuario } = useAuth();
  const { mostrar } = useAviso();
  const chave = "wave:chamados:" + usuario.id;
  const [chamados, setChamados] = useState(() => ler(chave, []));
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erros, setErros] = useState({});

  function enviar(evento) {
    evento.preventDefault();
    const novos = {};
    if (assunto === "") {
      novos.assunto = "Escolha um assunto.";
    }
    if (descricao.trim().length < 10) {
      novos.descricao = "Conte com pelo menos 10 caracteres o que aconteceu.";
    }
    setErros(novos);
    if (Object.keys(novos).length > 0) {
      document.getElementById(novos.assunto ? "assunto" : "descricao").focus();
      return;
    }
    const chamado = {
      protocolo: String(Date.now()).slice(-6),
      assunto,
      descricao: descricao.trim(),
      status: "Aberto",
      criadoEm: new Date().toISOString()
    };
    const lista = [chamado, ...chamados];
    gravar(chave, lista);
    setChamados(lista);
    setAssunto("");
    setDescricao("");
    mostrar("Chamado nº " + chamado.protocolo + " aberto. Responderemos em " + usuario.email + ".");
  }

  return (
    <>
      <p>
        <Link to="/configuracoes" className="voltar">
          <Icone nome="voltar" tamanho={18} />
          Voltar para as configurações
        </Link>
      </p>
      <h1 className="titulo-pagina">Suporte</h1>
      <section className="secao cartao-config" aria-labelledby="titulo-chamado">
        <h2 id="titulo-chamado">Abrir um chamado</h2>
        <p className="dica">Conte o que aconteceu. A resposta vai para {usuario.email}.</p>
        <form className="formulario" onSubmit={enviar} noValidate>
          <div className="campo">
            <label htmlFor="assunto">Assunto</label>
            <select
              id="assunto"
              value={assunto}
              aria-invalid={erros.assunto ? "true" : "false"}
              aria-describedby={erros.assunto ? "assunto-erro" : undefined}
              className={erros.assunto ? "input-erro" : undefined}
              onChange={(evento) => setAssunto(evento.target.value)}
            >
              <option value="">Escolha um assunto</option>
              {ASSUNTOS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {erros.assunto && (
              <p className="mensagem-erro" id="assunto-erro" role="alert">
                <Icone nome="alerta" tamanho={16} />
                {erros.assunto}
              </p>
            )}
          </div>
          <div className="campo">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              rows={4}
              value={descricao}
              maxLength={600}
              aria-invalid={erros.descricao ? "true" : "false"}
              aria-describedby={erros.descricao ? "descricao-erro" : undefined}
              className={erros.descricao ? "input-erro" : undefined}
              onChange={(evento) => setDescricao(evento.target.value)}
            />
            {erros.descricao && (
              <p className="mensagem-erro" id="descricao-erro" role="alert">
                <Icone nome="alerta" tamanho={16} />
                {erros.descricao}
              </p>
            )}
          </div>
          <button type="submit" className="botao botao-azul">
            Enviar chamado
          </button>
        </form>
      </section>

      <section className="secao" aria-labelledby="titulo-meus-chamados">
        <h2 id="titulo-meus-chamados">Seus chamados</h2>
        {chamados.length === 0 ? (
          <p className="dica">Você ainda não abriu nenhum chamado.</p>
        ) : (
          <ul className="chamados">
            {chamados.map((chamado) => (
              <li key={chamado.protocolo} className="chamado">
                <span className="escolha-nome">
                  Nº {chamado.protocolo} · {chamado.assunto}
                </span>
                <span className="dica">
                  {new Date(chamado.criadoEm).toLocaleDateString("pt-BR")} · {chamado.status}
                </span>
                <span>{chamado.descricao}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
