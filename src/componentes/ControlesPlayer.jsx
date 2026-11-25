import Icone from "./Icone.jsx";
import { usePlayer } from "../contextos/PlayerContext.jsx";
import { formatarTempo } from "../servicos/youtube.js";

export function Transporte() {
  const player = usePlayer();
  const rotuloRepetir = {
    nao: "Repetir: desligado",
    tudo: "Repetir: toda a fila",
    um: "Repetir: esta música"
  }[player.repetir];

  return (
    <div className="transporte">
      <button
        type="button"
        className="botao-icone"
        aria-label="Ordem aleatória"
        aria-pressed={player.aleatorio}
        onClick={player.alternarAleatorio}
      >
        <Icone nome="aleatorio" />
      </button>
      <button type="button" className="botao-icone" aria-label="Música anterior" onClick={player.anterior}>
        <Icone nome="anterior" />
      </button>
      <button
        type="button"
        className="botao-icone botao-tocar"
        aria-label={player.tocando ? "Pausar" : "Tocar"}
        aria-busy={player.carregando}
        onClick={player.alternar}
      >
        {player.carregando && !player.tocando ? (
          <span className="giro giro-claro" aria-hidden="true" />
        ) : (
          <Icone nome={player.tocando ? "pause" : "play"} tamanho={26} />
        )}
      </button>
      <button type="button" className="botao-icone" aria-label="Próxima música" onClick={() => player.proxima(false)}>
        <Icone nome="proxima" />
      </button>
      <button
        type="button"
        className={"botao-icone" + (player.repetir === "um" ? " repetir-um" : "")}
        aria-label={rotuloRepetir}
        aria-pressed={player.repetir !== "nao"}
        onClick={player.alternarRepeticao}
      >
        <Icone nome="repetir" />
        {player.repetir === "um" && <span className="repetir-selo">1</span>}
      </button>
    </div>
  );
}

export function Progresso() {
  const player = usePlayer();
  const total = Math.max(1, Math.round(player.duracao));
  const atual = Math.min(total, Math.round(player.progresso));

  return (
    <div className="progresso">
      <span className="tempo" aria-hidden="true">
        {formatarTempo(atual)}
      </span>
      <input
        type="range"
        min="0"
        max={total}
        step="1"
        value={atual}
        aria-label="Posição da música"
        aria-valuetext={formatarTempo(atual) + " de " + formatarTempo(total)}
        onChange={(evento) => player.buscar(Number(evento.target.value))}
      />
      <span className="tempo" aria-hidden="true">
        {formatarTempo(total)}
      </span>
    </div>
  );
}

export function Volume() {
  const player = usePlayer();
  return (
    <div className="volume">
      <Icone nome="volume" tamanho={20} />
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={player.volume}
        aria-label="Volume"
        onChange={(evento) => player.mudarVolume(Number(evento.target.value))}
      />
    </div>
  );
}
