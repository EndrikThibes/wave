import { useState } from "react";
import Icone from "./Icone.jsx";

export default function Campo({
  id,
  rotulo,
  tipo = "text",
  valor,
  aoMudar,
  aoSair,
  erro,
  dica,
  placeholder,
  autoComplete,
  extra,
  inputMode
}) {
  const [mostrar, setMostrar] = useState(false);
  const ehSenha = tipo === "password";
  const tipoReal = ehSenha && mostrar ? "text" : tipo;
  const ids = [];
  if (extra) {
    ids.push(id + "-extra");
  }
  if (dica) {
    ids.push(id + "-dica");
  }
  if (erro) {
    ids.push(id + "-erro");
  }

  const entrada = (
    <input
      id={id}
      name={id}
      type={tipoReal}
      value={valor}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      aria-invalid={erro ? "true" : "false"}
      aria-describedby={ids.length > 0 ? ids.join(" ") : undefined}
      className={erro ? "input-erro" : undefined}
      onChange={(evento) => aoMudar(evento.target.value)}
      onBlur={aoSair}
    />
  );

  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      {ehSenha ? (
        <div className="caixa-senha">
          {entrada}
          <button
            type="button"
            className="botao-icone botao-olho"
            aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={mostrar}
            onClick={() => setMostrar(!mostrar)}
          >
            <Icone nome={mostrar ? "olhoRiscado" : "olho"} />
          </button>
        </div>
      ) : (
        entrada
      )}
      {extra && <div id={id + "-extra"}>{extra}</div>}
      {dica && !erro && (
        <p className="dica" id={id + "-dica"}>
          {dica}
        </p>
      )}
      {erro && (
        <p className="mensagem-erro" id={id + "-erro"} role="alert">
          <Icone nome="alerta" tamanho={16} />
          {erro}
        </p>
      )}
    </div>
  );
}
