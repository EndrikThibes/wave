import { useState } from "react";

export function useFormulario(valoresIniciais, regras, dependentes) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});

  function revalidar(campo, novosValores, errosAtuais) {
    const resultado = { ...errosAtuais };
    resultado[campo] = regras[campo](novosValores);
    const outros = (dependentes && dependentes[campo]) || [];
    outros.forEach((outro) => {
      if (novosValores[outro] !== "") {
        resultado[outro] = regras[outro](novosValores);
      }
    });
    return resultado;
  }

  function mudar(campo, valor) {
    const novosValores = { ...valores, [campo]: valor };
    setValores(novosValores);
    if (erros[campo] || (dependentes && dependentes[campo])) {
      const podeValidar = erros[campo] || novosValores[campo] !== "";
      if (podeValidar) {
        setErros(revalidar(campo, novosValores, erros));
      }
    }
  }

  function sair(campo) {
    if (valores[campo] !== "") {
      setErros({ ...erros, [campo]: regras[campo](valores) });
    }
  }

  function validarTudo() {
    const novos = {};
    let primeiro = null;
    Object.keys(regras).forEach((campo) => {
      const mensagem = regras[campo](valores);
      novos[campo] = mensagem;
      if (mensagem !== "" && primeiro === null) {
        primeiro = campo;
      }
    });
    setErros(novos);
    if (primeiro !== null) {
      const elemento = document.getElementById(primeiro);
      if (elemento) {
        elemento.focus();
      }
    }
    return primeiro === null;
  }

  function limpar() {
    setValores(valoresIniciais);
    setErros({});
  }

  return { valores, erros, mudar, sair, validarTudo, limpar };
}
