import { createContext, useCallback, useContext, useRef, useState } from "react";

const AvisoContext = createContext(null);

export function AvisoProvider({ children }) {
  const [aviso, setAviso] = useState(null);
  const temporizador = useRef(null);

  const mostrar = useCallback((texto, acao) => {
    clearTimeout(temporizador.current);
    setAviso({ texto, acao: acao || null });
    temporizador.current = setTimeout(() => setAviso(null), acao ? 6000 : 3500);
  }, []);

  function fechar() {
    clearTimeout(temporizador.current);
    setAviso(null);
  }

  function clicarNaAcao() {
    aviso.acao.aoClicar();
    fechar();
  }

  return (
    <AvisoContext.Provider value={{ mostrar }}>
      {children}
      <div className="avisos" role="status" aria-live="polite">
        {aviso !== null && (
          <div className="aviso">
            <span>{aviso.texto}</span>
            {aviso.acao !== null && (
              <button type="button" className="aviso-acao" onClick={clicarNaAcao}>
                {aviso.acao.rotulo}
              </button>
            )}
          </div>
        )}
      </div>
    </AvisoContext.Provider>
  );
}

export function useAviso() {
  return useContext(AvisoContext);
}
