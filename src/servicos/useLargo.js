import { useEffect, useState } from "react";

export function useLargo() {
  const consulta = "(min-width: 1100px)";
  const [largo, setLargo] = useState(() => window.matchMedia(consulta).matches);

  useEffect(() => {
    const lista = window.matchMedia(consulta);
    const atualizar = () => setLargo(lista.matches);
    lista.addEventListener("change", atualizar);
    return () => lista.removeEventListener("change", atualizar);
  }, []);

  return largo;
}
