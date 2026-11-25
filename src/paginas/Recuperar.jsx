import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TelaAuth from "../componentes/TelaAuth.jsx";
import Campo from "../componentes/Campo.jsx";
import { useFormulario } from "../servicos/useFormulario.js";
import { useTitulo } from "../servicos/useTitulo.js";
import { buscarPorEmail, redefinirSenha } from "../servicos/usuarios.js";
import { validarConfirmacao, validarEmail, validarSenhaNova } from "../servicos/validacao.js";

const REGRAS = {
  email: (v) => validarEmail(v.email),
  senha: (v) => validarSenhaNova(v.senha),
  confirmar: (v) => validarConfirmacao(v.senha, v.confirmar)
};

export default function Recuperar() {
  useTitulo("Recuperar senha");
  const navegar = useNavigate();
  const formulario = useFormulario({ email: "", senha: "", confirmar: "" }, REGRAS, { senha: ["confirmar"] });
  const [enviando, setEnviando] = useState(false);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setNaoEncontrado(false);
    if (!formulario.validarTudo()) {
      return;
    }
    if (buscarPorEmail(formulario.valores.email) === null) {
      setNaoEncontrado(true);
      document.getElementById("email").focus();
      return;
    }
    setEnviando(true);
    await redefinirSenha(formulario.valores.email, formulario.valores.senha);
    navegar("/login", { state: { mensagem: "Senha atualizada. Entre com a nova senha." } });
  }

  return (
    <TelaAuth ligacaoTopo={<Link to="/login">Voltar para o login</Link>}>
      <div className="cartao-auth">
        <div>
          <h1>Recuperar senha</h1>
          <p className="subtitulo">
            O Wave guarda tudo no seu navegador, sem envio de e-mail. Informe seu e-mail e escolha uma nova senha.
          </p>
        </div>
        <form className="formulario" onSubmit={enviar} noValidate>
          <Campo
            id="email"
            rotulo="E-mail da conta"
            tipo="email"
            placeholder="nome@dominio.com"
            autoComplete="email"
            valor={formulario.valores.email}
            aoMudar={(v) => {
              setNaoEncontrado(false);
              formulario.mudar("email", v);
            }}
            aoSair={() => formulario.sair("email")}
            erro={formulario.erros.email}
          />
          {naoEncontrado && (
            <p className="alerta" role="alert">
              Não encontramos uma conta com esse e-mail neste navegador.
            </p>
          )}
          <Campo
            id="senha"
            rotulo="Nova senha"
            tipo="password"
            placeholder="Mínimo de 8 caracteres"
            autoComplete="new-password"
            valor={formulario.valores.senha}
            aoMudar={(v) => formulario.mudar("senha", v)}
            aoSair={() => formulario.sair("senha")}
            erro={formulario.erros.senha}
          />
          <Campo
            id="confirmar"
            rotulo="Confirmar nova senha"
            tipo="password"
            placeholder="Repita a senha"
            autoComplete="new-password"
            valor={formulario.valores.confirmar}
            aoMudar={(v) => formulario.mudar("confirmar", v)}
            aoSair={() => formulario.sair("confirmar")}
            erro={formulario.erros.confirmar}
          />
          <button type="submit" className="botao botao-azul botao-cheio" disabled={enviando} aria-busy={enviando}>
            {enviando ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </TelaAuth>
  );
}
