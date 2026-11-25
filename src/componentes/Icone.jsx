const ICONES = {
  inicio: <path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10M10 19.5v-5h4v5" />,
  buscar: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  biblioteca: <path d="M5 4v16M10 4v16M15.5 5.5l4 14.5M3 20h18" />,
  config: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1-4 4-5.5 7.5-5.5s6.5 1.5 7.5 5.5" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" />,
  pause: <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />,
  proxima: <path d="M6 5.5v13l9-6.5zM18 5.5v13" fill="currentColor" />,
  anterior: <path d="M18 5.5v13L9 12zM6 5.5v13" fill="currentColor" />,
  aleatorio: <path d="M3 7h3.5c2.5 0 4 1.5 5.5 5s3 5 5.5 5H21M3 17h3.5c1.5 0 2.7-.7 3.7-2M13.8 9c1-1.3 2.2-2 3.7-2H21M18.5 4.5 21 7l-2.5 2.5M18.5 14.5 21 17l-2.5 2.5" />,
  repetir: <path d="M4 11V9.5A2.5 2.5 0 0 1 6.5 7H19m0 0-2.5-2.5M19 7l-2.5 2.5M20 13v1.5a2.5 2.5 0 0 1-2.5 2.5H5m0 0 2.5 2.5M5 17l2.5-2.5" />,
  volume: <path d="M4 9.5v5h3.5l4.5 3.5v-12L7.5 9.5zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />,
  coracao: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 7.5 2.3C19.5 15.4 12 20 12 20z" />,
  mais: <path d="M12 5v14M5 12h14" />,
  fechar: <path d="M6 6l12 12M18 6 6 18" />,
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  lua: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  olho: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  olhoRiscado: (
    <>
      <path d="M3 3l18 18M10.2 5.7A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15 15 0 0 1-2.8 3.5M6.4 7.4A15 15 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4-.9" />
      <path d="M9.8 9.8a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  lixeira: <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" />,
  editar: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  fila: <path d="M4 6h12M4 11h12M4 16h7M16 14.5v5.5l4.5-2.8z" />,
  baixo: <path d="m6 9 6 6 6-6" />,
  cima: <path d="m6 15 6-6 6 6" />,
  voltar: <path d="m15 5-7 7 7 7" />,
  alerta: (
    <>
      <path d="M12 4 3 19.5h18L12 4Z" />
      <path d="M12 10v4.5M12 17.2v.1" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  ondas: <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0M3 18c2-4 4-4 6 0s4 4 6 0 4-4 6 0M3 6c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />,
  nota: <path d="M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 9 18zm10-2a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 19 16z" />,
  Pop: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />,
  Rock: <path d="M13.5 2.5 5 13.5h6l-1 8 9-11.5h-6z" />,
  Eletrônica: <path d="M5 14v5M9 8v11M13 4v15M17 10v9M21 13v6" />,
  "Lo-Fi": (
    <>
      <path d="M17.5 15.5A6.5 6.5 0 0 1 9 5.5a7 7 0 1 0 8.5 10z" />
      <path d="M17 4.5v3M15.5 6h3" />
    </>
  ),
  "Hip Hop": (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7" />
    </>
  ),
  Sertanejo: <path d="M2.5 16.5c3.5 1.5 15.5 1.5 19 0M6 15.5c0-4 1-8 3-8 1 0 1.5 1 3 1s2-1 3-1c2 0 3 4 3 8" />,
  MPB: (
    <>
      <circle cx="9" cy="15" r="5" />
      <path d="m12.5 11.5 7-7M17.5 3.5l3 3M7.5 15h3" />
    </>
  ),
  Funk: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <circle cx="12" cy="9" r="2" />
      <circle cx="12" cy="16" r="3" />
    </>
  ),
  Jazz: <path d="M7 18V6l11-2v12M7 18a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 7 18zm11-2a2.5 2.5 0 1 1-2.5-2.5A2.5 2.5 0 0 1 18 16zM7 10l11-2" />,
  Indie: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5" />
    </>
  ),
  Clássica: <path d="M3.5 6h17v12h-17zM8 6v7M12 6v7M16 6v7M6.5 13h3M10.5 13h3M14.5 13h3" />,
  Trap: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
      <path d="M8 4v6M16 9v6M11 14v6" />
    </>
  ),
  "Bossa Nova": (
    <>
      <path d="M3 18c4-6 14-6 18 0" />
      <circle cx="12" cy="8" r="3" />
      <path d="M12 2v1.5M7 4.5l1 1M17 4.5l-1 1" />
    </>
  ),
  Pagode: (
    <>
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
      <path d="M9 12.5v3M15 12.5v3" />
    </>
  ),
  ajuda: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 5 .3c0 1.7-2.5 2-2.5 3.7M12 16.8v.2" />
    </>
  ),
  disco: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  Reggae: (
    <>
      <circle cx="12" cy="9" r="4" />
      <path d="M12 2v1.5M5.5 4.5l1 1M18.5 4.5l-1 1M2 9h1.5M20.5 9H22M3 20c3-2 6-2 9 0s6 2 9 0" />
    </>
  )
};

export default function Icone({ nome, tamanho = 24, preenchido = false, className }) {
  return (
    <svg
      className={className}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill={preenchido ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONES[nome]}
    </svg>
  );
}
