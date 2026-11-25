import { createContext, useContext, useEffect, useState } from "react";
import { lerTexto, gravarTexto } from "../servicos/armazenamento.js";

const TemaContext = createContext(null);

function temaInicial() {
  const salvo = lerTexto("wave:tema");
  if (salvo === "light" || salvo === "dark") {
    return salvo;
  }
  return "dark";
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  function alternarTema() {
    const novo = tema === "dark" ? "light" : "dark";
    gravarTexto("wave:tema", novo);
    setTema(novo);
  }

  return <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>;
}

export function useTema() {
  return useContext(TemaContext);
}
