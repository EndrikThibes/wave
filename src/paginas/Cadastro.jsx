import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TelaAuth from "../componentes/TelaAuth.jsx";
import Campo from "../componentes/Campo.jsx";
import IndicadorForca from "../componentes/IndicadorForca.jsx";
import Passos from "../componentes/Passos.jsx";
import SeletorGeneros from "../componentes/SeletorGeneros.jsx";
import Icone from "../componentes/Icone.jsx";
import { useAuth } from "../contextos/AuthContext.jsx";
import { useFormulario } from "../servicos/useFormulario.js";
import { useTitulo } from "../servicos/useTitulo.js";
import { buscarPorEmail } from "../servicos/usuarios.js";
import { validarConfirmacao, validarEmail, validarNome, validarSenhaNova } from "../servicos/validacao.js";

const MINIMO_GENEROS = 3;
const TITULOS = ["", "Criar conta", "Gêneros", "Pronto"];

const REGRAS = {
  nome: (v) => validarNome(v.nome),
  email: (v) => {
    const erro = validarEmail(v.email);
    if (erro !== "") {
      return erro;
    }
    if (buscarPorEmail(v.email) !== null) {
      return "Este e-mail já tem uma conta. Que tal entrar?";
    }
    return "";
  },
  senha: (v) => validarSenhaNova(v.senha),
  confirmar: (v) => validarConfirmacao(v.senha, v.confirmar)
};

export default function Cadastro() {
  const { cadastrar, iniciar } = useAuth();
  const [etapa, setEtapa] = useState(1);
  useTitulo(TITULOS[etapa]);
  const formulario = useFormulario({ nome: "", email: "", senha: "", confirmar: "" }, REGRAS, {
    senha: ["confirmar"]
  });
  const [aceitou, setAceitou] = useState(false);
  const [erroTermos, setErroTermos] = useState(false);
  const [generos, setGeneros] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [contaCriada, setContaCriada] = useState(null);
  const [trouxeBiblioteca, setTrouxeBiblioteca] = useState(false);
  const tituloRef = useRef(null);
  const primeiraVez = useRef(true);

  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    if (tituloRef.current) {
      tituloRef.current.focus();
    }
  }, [etapa]);

  function alternarTermos(marcado) {
    setAceitou(marcado);
    setErroTermos(!marcado);
  }

  function continuar(evento) {
    evento.preventDefault();
    const valido = formulario.validarTudo();
    if (!aceitou) {
      setErroTermos(true);
    }
    if (!valido) {
      return;
    }
    if (!aceitou) {
      document.getElementById("termos").focus();
      return;
    }
    setEtapa(2);
  }

  function alternarGenero(nome) {
    if (generos.includes(nome)) {
      setGeneros(generos.filter((g) => g !== nome));
    } else {
      setGeneros([...generos, nome]);
    }
  }

  async function concluir(lista) {
    setSalvando(true);
    const resultado = await cadastrar({
      nome: formulario.valores.nome,
      email: formulario.valores.email,
      senha: formulario.valores.senha,
      generos: lista
    });
    setContaCriada(resultado.conta);
    setTrouxeBiblioteca(resultado.trouxeBiblioteca);
    setSalvando(false);
    setEtapa(3);
  }

  const faltam = MINIMO_GENEROS - generos.length;

  return (
    <TelaAuth ligacaoTopo={<Link to="/login">Já tenho conta</Link>}>
      <div className="cartao-auth">
        <Passos atual={etapa} />

        {etapa === 1 && (
          <form className="etapa" onSubmit={continuar} noValidate>
            <div>
              <h1 ref={tituloRef} tabIndex={-1} className="titulo-etapa">
                Crie sua conta
              </h1>
              <p className="subtitulo">Leva menos de um minuto.</p>
            </div>
            <Campo
              id="nome"
              rotulo="Como podemos te chamar?"
              placeholder="Seu nome"
              autoComplete="given-name"
              valor={formulario.valores.nome}
              aoMudar={(v) => formulario.mudar("nome", v)}
              aoSair={() => formulario.sair("nome")}
              erro={formulario.erros.nome}
            />
            <Campo
              id="email"
              rotulo="E-mail"
              tipo="email"
              placeholder="nome@dominio.com"
              autoComplete="email"
              valor={formulario.valores.email}
              aoMudar={(v) => formulario.mudar("email", v)}
              aoSair={() => formulario.sair("email")}
              erro={formulario.erros.email}
            />
            <Campo
              id="senha"
              rotulo="Senha"
              tipo="password"
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              valor={formulario.valores.senha}
              aoMudar={(v) => formulario.mudar("senha", v)}
              aoSair={() => formulario.sair("senha")}
              erro={formulario.erros.senha}
              extra={<IndicadorForca senha={formulario.valores.senha} />}
            />
            <Campo
              id="confirmar"
              rotulo="Confirmar senha"
              tipo="password"
              placeholder="Repita a senha"
              autoComplete="new-password"
              valor={formulario.valores.confirmar}
              aoMudar={(v) => formulario.mudar("confirmar", v)}
              aoSair={() => formulario.sair("confirmar")}
              erro={formulario.erros.confirmar}
            />
            <div>
              <label className="termos" htmlFor="termos">
                <input
                  id="termos"
                  type="checkbox"
                  checked={aceitou}
                  aria-describedby={erroTermos ? "termos-erro" : undefined}
                  aria-invalid={erroTermos ? "true" : "false"}
                  onChange={(evento) => alternarTermos(evento.target.checked)}
                />
                <span>
                  Li e aceito os{" "}
                  <Link to="/privacidade" target="_blank">
                    Termos de uso e a Política de privacidade
                  </Link>
                  <span className="so-leitor"> (abre em nova aba)</span>.
                </span>
              </label>
              {erroTermos && (
                <p className="mensagem-erro" id="termos-erro" role="alert">
                  Aceite os termos para criar a conta.
                </p>
              )}
            </div>
            <button type="submit" className="botao botao-azul botao-cheio">
              Continuar para os gêneros
            </button>
            <p className="troca">
              Já tem conta? <Link to="/login">Entrar na conta</Link>
            </p>
          </form>
        )}

        {etapa === 2 && (
          <div className="etapa">
            <div>
              <h1 ref={tituloRef} tabIndex={-1} className="titulo-etapa">
                Quais gêneros você curte?
              </h1>
              <p className="subtitulo">Escolha pelo menos {MINIMO_GENEROS} para montarmos a sua onda.</p>
            </div>
            <SeletorGeneros escolhidos={generos} aoAlternar={alternarGenero} />
            <p className="contador" aria-live="polite">
              {faltam > 0 ? (
                <>
                  <strong>{generos.length}</strong> de {MINIMO_GENEROS} escolhidos · faltam {faltam}
                </>
              ) : (
                <>
                  <strong>{generos.length}</strong> escolhidos · ótimo!
                </>
              )}
            </p>
            <div className="acoes">
              <button type="button" className="botao-link" onClick={() => concluir([])} disabled={salvando}>
                Pular por agora
              </button>
              <button
                type="button"
                className="botao botao-azul"
                disabled={faltam > 0 || salvando}
                aria-busy={salvando}
                onClick={() => concluir(generos)}
              >
                {faltam > 0 ? "Escolha mais " + faltam : salvando ? "Criando conta…" : "Concluir cadastro"}
              </button>
            </div>
          </div>
        )}

        {etapa === 3 && contaCriada !== null && (
          <div className="etapa pronto">
            <div className="pronto-icone" aria-hidden="true">
              <Icone nome="check" tamanho={40} />
            </div>
            <div>
              <h1 ref={tituloRef} tabIndex={-1} className="titulo-etapa">
                Tudo pronto, {contaCriada.nome}!
              </h1>
              <p className="subtitulo">
                {contaCriada.generos.length > 0
                  ? "Já montamos a sua onda com base nos seus gostos."
                  : "Você pode escolher seus gêneros depois, em Ajustes."}
              </p>
              {trouxeBiblioteca && (
                <p className="subtitulo">Suas curtidas e playlists de visitante foram trazidas para esta conta.</p>
              )}
            </div>
            {contaCriada.generos.length > 0 && (
              <ul className="tags" aria-label="Gêneros escolhidos">
                {contaCriada.generos.map((g) => (
                  <li key={g} className="tag">
                    {g}
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="botao botao-azul botao-cheio" onClick={() => iniciar(contaCriada)}>
              Ir para o Wave
            </button>
          </div>
        )}
      </div>
    </TelaAuth>
  );
}
