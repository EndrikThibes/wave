import { useState } from "react";
import Dialogo from "../componentes/Dialogo.jsx";
import Campo from "../componentes/Campo.jsx";
import SeletorGeneros from "../componentes/SeletorGeneros.jsx";
import Icone from "../componentes/Icone.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../contextos/AuthContext.jsx";
import { useAviso } from "../contextos/AvisoContext.jsx";
import { useBiblioteca } from "../contextos/BibliotecaContext.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { useTema } from "../contextos/TemaContext.jsx";
import { useFormulario } from "../servicos/useFormulario.js";
import { useTitulo } from "../servicos/useTitulo.js";
import { validarNome } from "../servicos/validacao.js";

const REGRAS = { nome: (v) => validarNome(v.nome) };

export default function Configuracoes() {
  useTitulo("Ajustes");
  const { usuario, editarPerfil, apagarConta, exportarDados, sair } = useAuth();
  const { mostrar } = useAviso();
  const biblioteca = useBiblioteca();
  const player = usePlayer();
  const { tema, alternarTema } = useTema();
  const formulario = useFormulario({ nome: usuario.nome }, REGRAS);
  const [generos, setGeneros] = useState(usuario.generos || []);
  const [erroGeneros, setErroGeneros] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  function alternarGenero(nome) {
    setErroGeneros("");
    setGeneros(generos.includes(nome) ? generos.filter((g) => g !== nome) : [...generos, nome]);
  }

  function salvar(evento) {
    evento.preventDefault();
    if (!formulario.validarTudo()) {
      return;
    }
    if (generos.length < 3) {
      setErroGeneros("Escolha pelo menos 3 gêneros.");
      return;
    }
    editarPerfil({ nome: formulario.valores.nome.trim(), generos });
    mostrar("Perfil atualizado.");
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

  function limpar() {
    biblioteca.limparHistorico();
    mostrar("Histórico apagado.");
  }

  function excluirConta() {
    player.fecharPlayer();
    apagarConta();
  }

  return (
    <>
      <h1 className="titulo-pagina">Ajustes</h1>

      <section className="secao cartao-config" aria-labelledby="titulo-aparencia">
        <h2 id="titulo-aparencia">Aparência</h2>
        <p className="dica">O tema escolhido fica salvo neste navegador.</p>
        <button type="button" className="botao botao-borda" aria-pressed={tema === "light"} onClick={alternarTema}>
          <Icone nome={tema === "dark" ? "sol" : "lua"} tamanho={18} />
          {tema === "dark" ? "Usar tema claro" : "Usar tema escuro"}
        </button>
      </section>

      {usuario.visitante ? (
        <section className="secao cartao-config" aria-labelledby="titulo-visitante">
          <h2 id="titulo-visitante">Você está como visitante</h2>
          <p className="dica">
            Suas curtidas e playlists ficam salvas neste navegador. Ao criar uma conta, elas vão junto e você escolhe
            seus gêneros favoritos.
          </p>
          <p>
            <Link to="/cadastro" className="botao botao-azul">
              Criar conta e levar minha biblioteca
            </Link>
          </p>
        </section>
      ) : (
      <section className="secao cartao-config" aria-labelledby="titulo-perfil">
        <h2 id="titulo-perfil">Seu perfil</h2>
        <form className="formulario" onSubmit={salvar} noValidate>
          <Campo
            id="nome"
            rotulo="Nome"
            valor={formulario.valores.nome}
            aoMudar={(v) => formulario.mudar("nome", v)}
            aoSair={() => formulario.sair("nome")}
            erro={formulario.erros.nome}
            autoComplete="given-name"
          />
          <p className="dica">E-mail da conta: {usuario.email}</p>
          <fieldset className="grupo">
            <legend>Gêneros favoritos</legend>
            <SeletorGeneros escolhidos={generos} aoAlternar={alternarGenero} />
            {erroGeneros && (
              <p className="mensagem-erro" role="alert">
                {erroGeneros}
              </p>
            )}
          </fieldset>
          <button type="submit" className="botao botao-azul">
            Salvar alterações
          </button>
        </form>
      </section>

      )}

      <section className="secao cartao-config" aria-labelledby="titulo-dados">
        <h2 id="titulo-dados">Seus dados</h2>
        <p className="dica">
          Tudo o que o Wave guarda fica só neste navegador. Você pode levar uma cópia ou apagar tudo quando quiser.
        </p>
        <div className="acoes-linha">
          <button type="button" className="botao botao-borda" onClick={baixarDados}>
            Baixar meus dados
          </button>
          <button type="button" className="botao botao-borda" onClick={limpar}>
            Apagar histórico de reprodução
          </button>
          {!usuario.visitante && (
            <button type="button" className="botao botao-perigo" onClick={() => setExcluindo(true)}>
              Excluir minha conta
            </button>
          )}
        </div>
      </section>

      <p>
        <button type="button" className="botao botao-borda" onClick={sair}>
          {usuario.visitante ? "Sair do modo visitante" : "Sair da conta"}
        </button>
      </p>

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
