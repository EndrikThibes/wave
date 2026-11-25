import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TelaAuth from "../componentes/TelaAuth.jsx";
import Campo from "../componentes/Campo.jsx";
import Icone from "../componentes/Icone.jsx";
import { useAuth } from "../contextos/AuthContext.jsx";
import { useFormulario } from "../servicos/useFormulario.js";
import { useTitulo } from "../servicos/useTitulo.js";
import { validarEmail } from "../servicos/validacao.js";

const REGRAS = {
  email: (v) => validarEmail(v.email),
  senha: (v) => (v.senha === "" ? "Digite sua senha." : "")
};

export default function Login() {
  useTitulo("Entrar");
  const { entrar } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();
  const destino = (local.state && local.state.de) || "/inicio";
  const formulario = useFormulario({ email: "", senha: "" }, REGRAS);
  const [enviando, setEnviando] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const mensagem = local.state && local.state.mensagem;

  function mudar(campo, valor) {
    setFalhou(false);
    formulario.mudar(campo, valor);
  }

  async function enviar(evento) {
    evento.preventDefault();
    setFalhou(false);
    if (!formulario.validarTudo()) {
      return;
    }
    setEnviando(true);
    const deuCerto = await entrar(formulario.valores.email, formulario.valores.senha, lembrar);
    setEnviando(false);
    if (deuCerto) {
      navegar(destino, { replace: true });
    } else {
      setFalhou(true);
      document.getElementById("senha").select();
    }
  }

  return (
    <TelaAuth>
      <div className="cartao-auth">
        <div>
          <h1>Entrar no Wave</h1>
          <p className="subtitulo">Entre para continuar ouvindo.</p>
        </div>
        {mensagem && (
          <p className="alerta alerta-sucesso" role="status">
            {mensagem}
          </p>
        )}
        <form className="formulario" onSubmit={enviar} noValidate>
          <Campo
            id="email"
            rotulo="E-mail"
            tipo="email"
            placeholder="nome@dominio.com"
            autoComplete="email"
            valor={formulario.valores.email}
            aoMudar={(v) => mudar("email", v)}
            aoSair={() => formulario.sair("email")}
            erro={formulario.erros.email}
          />
          <Campo
            id="senha"
            rotulo="Senha"
            tipo="password"
            placeholder="Sua senha"
            autoComplete="current-password"
            valor={formulario.valores.senha}
            aoMudar={(v) => mudar("senha", v)}
            aoSair={() => formulario.sair("senha")}
            erro={formulario.erros.senha}
          />
          {falhou && (
            <p className="alerta" role="alert">
              <Icone nome="alerta" tamanho={18} />
              E-mail ou senha incorretos. Confira os dados e tente de novo.
            </p>
          )}
          <label className="lembrar">
            <input type="checkbox" checked={lembrar} onChange={(evento) => setLembrar(evento.target.checked)} />
            Lembrar de mim neste computador
          </label>
          <button type="submit" className="botao botao-azul botao-cheio" disabled={enviando} aria-busy={enviando}>
            {enviando ? (
              <>
                <span className="giro" aria-hidden="true" /> Entrando…
              </>
            ) : (
              "Entrar na conta"
            )}
          </button>
          <p className="linha-ajuda">
            <Link to="/recuperar">Recuperar senha</Link>
          </p>
        </form>
        <p className="troca">
          Novo por aqui? <Link to="/cadastro">Criar conta grátis</Link>
        </p>
      </div>
    </TelaAuth>
  );
}
