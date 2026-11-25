let promessaApi = null;

export function carregarApiYoutube() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }
  if (promessaApi !== null) {
    return promessaApi;
  }
  promessaApi = new Promise((resolve, reject) => {
    const anterior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof anterior === "function") {
        anterior();
      }
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      promessaApi = null;
      reject(new Error("Falha ao carregar a API do YouTube"));
    };
    document.head.appendChild(script);
  });
  return promessaApi;
}

export function formatarTempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) {
    return "0:00";
  }
  const total = Math.floor(segundos);
  const minutos = Math.floor(total / 60);
  const resto = total % 60;
  return minutos + ":" + String(resto).padStart(2, "0");
}
