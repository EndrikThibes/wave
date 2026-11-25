import { useEffect, useRef } from "react";

export default function Dialogo({ aberto, aoFechar, titulo, children }) {
  const ref = useRef(null);
  const origem = useRef(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (aberto && !dialogo.open) {
      origem.current = document.activeElement;
      dialogo.showModal();
    }
    if (!aberto && dialogo.open) {
      dialogo.close();
    }
  }, [aberto]);

  useEffect(() => {
    return () => {
      if (origem.current && document.body.contains(origem.current)) {
        origem.current.focus();
      }
    };
  }, []);

  function aoClicarFora(evento) {
    if (evento.target === ref.current) {
      aoFechar();
    }
  }

  return (
    <dialog ref={ref} className="dialogo" aria-labelledby="titulo-dialogo" onClose={aoFechar} onClick={aoClicarFora}>
      {aberto && (
        <div>
          <h2 id="titulo-dialogo">{titulo}</h2>
          {children}
        </div>
      )}
    </dialog>
  );
}
