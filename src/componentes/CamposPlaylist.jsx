import Icone from "./Icone.jsx";

export default function CamposPlaylist({ idBase, nome, aoMudarNome, erro, publica, aoMudarPublica }) {
  return (
    <>
      <div className="campo">
        <label htmlFor={idBase + "-nome"}>Nome da playlist</label>
        <input
          id={idBase + "-nome"}
          value={nome}
          maxLength={60}
          placeholder="Ex.: Treino de sexta"
          aria-invalid={erro ? "true" : "false"}
          aria-describedby={erro ? idBase + "-erro" : undefined}
          className={erro ? "input-erro" : undefined}
          onChange={(evento) => aoMudarNome(evento.target.value)}
        />
        {erro && (
          <p className="mensagem-erro" id={idBase + "-erro"} role="alert">
            <Icone nome="alerta" tamanho={16} />
            {erro}
          </p>
        )}
      </div>
      <fieldset className="grupo visibilidade">
        <legend>Quem pode ver</legend>
        <label className="opcao">
          <input type="radio" name={idBase + "-visibilidade"} checked={!publica} onChange={() => aoMudarPublica(false)} />
          <span>
            <strong>Privada</strong>
            <span className="dica">Só aparece para você.</span>
          </span>
        </label>
        <label className="opcao">
          <input type="radio" name={idBase + "-visibilidade"} checked={publica} onChange={() => aoMudarPublica(true)} />
          <span>
            <strong>Pública</strong>
            <span className="dica">Aparece no seu perfil.</span>
          </span>
        </label>
      </fieldset>
    </>
  );
}
