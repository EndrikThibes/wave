import { useState } from "react";
import { Link } from "react-router-dom";
import Dialogo from "../componentes/Dialogo.jsx";
import Campo from "../componentes/Campo.jsx";
import SeletorGeneros from "../componentes/SeletorGeneros.jsx";
import Icone from "../componentes/Icone.jsx";
import { useAuth } from "../contextos/AuthContext.jsx";
import { useAviso } from "../contextos/AvisoContext.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { planoPorId, formatarPreco } from "../dados/planos.js";
import { preferenciasDe } from "../servicos/usuarios.js";
import { useFormulario } from "../servicos/useFormulario.js";
import { useTitulo } from "../servicos/useTitulo.js";
import { validarConfirmacao, validarNome, validarSenhaNova } from "../servicos/validacao.js";

const REGRAS_PERFIL = { nome: (v) => validarNome(v.nome) };

const REGRAS_SENHA = {
  atual: (v) => (v.atual === "" ? "Digite sua senha atual." : ""),
  nova: (v) => validarSenhaNova(v.nova),
  confirmar: (v) => validarConfirmacao(v.nova, v.confirmar)
};

const OPCOES = [
  { chave: "tocarProxima", rotulo: "Tocar a próxima música automaticamente", grupo: "Reprodução" },
  { chave: "avisarTroca", rotulo: "Avisar na tela quando a música mudar", grupo: "Reprodução" },
  { chave: "reduzirAnimacoes", rotulo: "Reduzir animações", grupo: "Acessibilidade" }
];

export default function Configuracoes() {
  useTitulo("Configurações");
  const { usuario, editarPerfil, mudarSenha, apagarConta, exportarDados, sair } = useAuth();
  const { mostrar } = useAviso();
  const biblioteca = useBiblioteca();
  const player = usePlayer();
  const perfil = useFormulario({ nome: usuario.nome }, REGRAS_PERFIL);
  const senha = useFormulario({ atual: "", nova: "", confirmar: "" }, REGRAS_SENHA, { nova: ["confirmar"] });
  const [generos, setGeneros] = useState(usuario.generos || []);
  const [erroGeneros, setErroGeneros] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const preferencias = preferenciasDe(usuario);
  const plano = planoPorId(usuario.plano);

  function alternarGenero(nome) {
    setErroGeneros("");
    setGeneros(generos.includes(nome) ? generos.filter((g) => g !== nome) : [...generos, nome]);
  }

  function salvarPerfil(evento) {
    evento.preventDefault();
    if (!perfil.validarTudo()) {
      return;
    }
    if (generos.length < 3) {
      setErroGeneros("Escolha pelo menos 3 gêneros.");
      return;
    }
    editarPerfil({ nome: perfil.valores.nome.trim(), generos });
    mostrar("Conta atualizada.");
  }

  async function salvarSenha(evento) {
    evento.preventDefault();
    if (!senha.validarTudo()) {
      return;
    }
    const deuCerto = await mudarSenha(senha.valores.atual, senha.valores.nova);
    if (!deuCerto) {
      senha.definirErro("atual", "A senha atual não confere.");
      document.getElementById("atual").focus();
      return;
    }
    senha.limpar();
    mostrar("Senha alterada.");
  }

  function mudarPreferencia(chave, valor) {
    editarPerfil({ preferencias: { ...preferencias, [chave]: valor } });
  }

  function baixarDados() {
    const texto = JSON.stringify(exportarDados(), null, 2);
    const arquivo = new Blob([texto], { type: "application/json" });
    const endereco = URL.createObjectURL(arquivo);
    const ancora = document.createElement("a");
    ancora.href = endereco;
    ancora.download = "meus-dados-wave.json";
    ancora.click();
    URL.revokeObjectURL(endereco);
    mostrar("Arquivo com seus dados baixado.");
  }

  function cancelarPlano() {
    editarPerfil({ plano: "gratis" });
    setCancelando(false);
    mostrar("Assinatura cancelada. Você está no plano Grátis.");
  }

  function excluirConta() {
    player.fecharPlayer();
    apagarConta();
  }

  return (
    <>
      <h1 className="titulo-pagina">Configurações</h1>

      <section className="secao cartao-config" aria-labelledby="titulo-plano">
        <h2 id="titulo-plano">Seu plano</h2>
        <p>
          <strong>{plano.nome}</strong>
          <span className="dica">
            {" "}
            · {plano.preco === 0 ? "sem custo" : formatarPreco(plano.preco) + " por mês"} · {plano.contas}
          </span>
        </p>
        <div className="acoes-linha">
          <Link to="/planos" className="botao botao-azul">
            {plano.preco === 0 ? "Conhecer os planos" : "Trocar de plano"}
          </Link>
          {plano.preco > 0 && (
            <button type="button" className="botao botao-borda" onClick={() => setCancelando(true)}>
              Cancelar assinatura
            </button>
          )}
        </div>
      </section>

      <section className="secao cartao-config" aria-labelledby="titulo-conta">
        <h2 id="titulo-conta">Conta</h2>
        <form className="formulario" onSubmit={salvarPerfil} noValidate>
          <Campo
            id="nome"
            rotulo="Nome"
            valor={perfil.valores.nome}
            aoMudar={(v) => perfil.mudar("nome", v)}
            aoSair={() => perfil.sair("nome")}
            erro={perfil.erros.nome}
            autoComplete="given-name"
          />
          <p className="dica">E-mail da conta: {usuario.email}</p>
          <fieldset className="grupo">
            <legend>Gêneros favoritos</legend>
            <SeletorGeneros escolhidos={generos} aoAlternar={alternarGenero} />
            {erroGeneros && (
              <p className="mensagem-erro" role="alert">
                <Icone nome="alerta" tamanho={16} />
                {erroGeneros}
              </p>
            )}
          </fieldset>
          <button type="submit" className="botao botao-azul">
            Salvar conta
          </button>
        </form>
      </section>

      <section className="secao cartao-config" aria-labelledby="titulo-senha">
        <h2 id="titulo-senha">Senha</h2>
        <form className="formulario" onSubmit={salvarSenha} noValidate>
          <Campo
            id="atual"
            rotulo="Senha atual"
            tipo="password"
            autoComplete="current-password"
            valor={senha.valores.atual}
            aoMudar={(v) => senha.mudar("atual", v)}
            aoSair={() => senha.sair("atual")}
            erro={senha.erros.atual}
          />
          <Campo
            id="nova"
            rotulo="Nova senha"
            tipo="password"
            autoComplete="new-password"
            dica="Pelo menos 8 caracteres, com letra e número."
            valor={senha.valores.nova}
            aoMudar={(v) => senha.mudar("nova", v)}
            aoSair={() => senha.sair("nova")}
            erro={senha.erros.nova}
          />
          <Campo
            id="confirmar"
            rotulo="Confirmar nova senha"
            tipo="password"
            autoComplete="new-password"
            valor={senha.valores.confirmar}
            aoMudar={(v) => senha.mudar("confirmar", v)}
            aoSair={() => senha.sair("confirmar")}
            erro={senha.erros.confirmar}
          />
          <button type="submit" className="botao botao-azul">
            Alterar senha
          </button>
        </form>
      </section>

      {["Reprodução", "Acessibilidade"].map((grupo) => (
        <section key={grupo} className="secao cartao-config" aria-labelledby={"titulo-" + grupo}>
          <h2 id={"titulo-" + grupo}>{grupo}</h2>
          <ul className="lista-escolha">
            {OPCOES.filter((opcao) => opcao.grupo === grupo).map((opcao) => (
              <li key={opcao.chave}>
                <label className="opcao">
                  <input
                    type="checkbox"
                    role="switch"
                    checked={preferencias[opcao.chave]}
                    onChange={(evento) => mudarPreferencia(opcao.chave, evento.target.checked)}
                  />
                  <span>{opcao.rotulo}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="secao cartao-config" aria-labelledby="titulo-dados">
        <h2 id="titulo-dados">Privacidade e dados</h2>
        <p className="dica">
          Tudo o que o Wave guarda fica só neste navegador. Leia os <Link to="/privacidade">termos e privacidade</Link>.
        </p>
        <div className="acoes-linha">
          <button type="button" className="botao botao-borda" onClick={baixarDados}>
            Baixar meus dados
          </button>
          <button
            type="button"
            className="botao botao-borda"
            onClick={() => {
              biblioteca.limparHistorico();
              mostrar("Histórico apagado.");
            }}
          >
            Apagar histórico de reprodução
          </button>
        </div>
      </section>

      <section className="secao cartao-config" aria-labelledby="titulo-ajuda">
        <h2 id="titulo-ajuda">Ajuda</h2>
        <p className="dica">Algo não funcionou? Abra um chamado e acompanhe a resposta.</p>
        <Link to="/suporte" className="botao botao-borda">
          <Icone nome="ajuda" tamanho={18} />
          Falar com o suporte
        </Link>
      </section>

      <section className="secao cartao-config" aria-labelledby="titulo-sessao">
        <h2 id="titulo-sessao">Sessão e conta</h2>
        <div className="acoes-linha">
          <button type="button" className="botao botao-borda" onClick={sair}>
            Sair da conta
          </button>
          <button type="button" className="botao botao-perigo" onClick={() => setExcluindo(true)}>
            Excluir minha conta
          </button>
        </div>
      </section>

      <Dialogo aberto={cancelando} aoFechar={() => setCancelando(false)} titulo="Cancelar a assinatura?">
        <p className="dialogo-texto">Você volta para o plano Grátis e mantém suas playlists e curtidas.</p>
        <div className="dialogo-acoes">
          <button type="button" className="botao botao-borda" onClick={() => setCancelando(false)}>
            Manter plano
          </button>
          <button type="button" className="botao botao-perigo" onClick={cancelarPlano}>
            Cancelar assinatura
          </button>
        </div>
      </Dialogo>

      <Dialogo aberto={excluindo} aoFechar={() => setExcluindo(false)} titulo="Excluir sua conta?">
        <p className="dialogo-texto">
          Seu perfil, suas playlists, curtidas e histórico serão apagados deste navegador. Esta ação não pode ser
          desfeita.
        </p>
        <div className="dialogo-acoes">
          <button type="button" className="botao botao-borda" onClick={() => setExcluindo(false)}>
            Manter minha conta
          </button>
          <button type="button" className="botao botao-perigo" onClick={excluirConta}>
            Excluir conta para sempre
          </button>
        </div>
      </Dialogo>
    </>
  );
}
