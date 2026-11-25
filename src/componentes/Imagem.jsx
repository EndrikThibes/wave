import { useState } from "react";

export default function Imagem({ src, alt = "", largura, altura, className = "", nome = "" }) {
  const [falhou, setFalhou] = useState(false);
  const inicial = nome.trim().charAt(0).toUpperCase();

  if (!src || falhou) {
    return (
      <span className={"imagem-reserva " + className} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        <span aria-hidden="true">{inicial}</span>
      </span>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={largura}
      height={altura}
      loading="lazy"
      decoding="async"
      onError={() => setFalhou(true)}
    />
  );
}
