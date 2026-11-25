import dados from "./catalogo.json";

const MAPA_FAIXAS = new Map(dados.faixas.map((f) => [f.id, f]));
const MAPA_ARTISTAS = new Map(dados.artistas.map((a) => [a.id, a]));

export const ARTISTAS = dados.artistas;
export const FAIXAS = dados.faixas;

export function faixaPorId(id) {
  return MAPA_FAIXAS.get(id);
}

export function artistaPorId(id) {
  return MAPA_ARTISTAS.get(id);
}

export function faixasDoArtista(artistaId) {
  return FAIXAS.filter((f) => f.artistaId === artistaId);
}

export function artistasDoGenero(genero) {
  return ARTISTAS.filter((a) => a.generos.includes(genero));
}

export function imagemDaCapa(faixa, tamanho) {
  return faixa.capa + "/" + tamanho + "x" + tamanho + "bb.jpg";
}

function semAcento(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function distancia(a, b) {
  const linha = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let anterior = linha[0];
    linha[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const guardado = linha[j];
      linha[j] = Math.min(linha[j] + 1, linha[j - 1] + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
      anterior = guardado;
    }
  }
  return linha[b.length];
}

function palavraCombina(palavra, palavrasDoTexto) {
  const tolerancia = palavra.length >= 5 ? 2 : palavra.length >= 3 ? 1 : 0;
  return palavrasDoTexto.some(
    (outra) => outra.startsWith(palavra) || distancia(palavra, outra.slice(0, palavra.length)) <= tolerancia
  );
}

export function combina(termo, texto) {
  const procurado = semAcento(termo.trim());
  if (procurado === "") {
    return true;
  }
  const limpo = semAcento(texto);
  if (limpo.includes(procurado)) {
    return true;
  }
  const palavrasDoTexto = limpo.split(/[^a-z0-9]+/).filter(Boolean);
  return procurado
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .every((palavra) => palavraCombina(palavra, palavrasDoTexto));
}

export function buscarFaixas(termo, genero) {
  return FAIXAS.filter((faixa) => {
    if (genero && faixa.genero !== genero) {
      return false;
    }
    const artista = artistaPorId(faixa.artistaId);
    return combina(termo, [faixa.titulo, faixa.album, artista.nome, faixa.genero].join(" "));
  });
}

export function buscarArtistas(termo, genero) {
  return ARTISTAS.filter((artista) => {
    if (genero && !artista.generos.includes(genero)) {
      return false;
    }
    return combina(termo, artista.nome + " " + artista.generos.join(" "));
  });
}

export function faixasDosGeneros(generos) {
  return FAIXAS.filter((f) => generos.includes(f.genero));
}

export function embaralhar(lista, semente) {
  const copia = [...lista];
  let estado = semente;
  for (let i = copia.length - 1; i > 0; i--) {
    estado = (estado * 9301 + 49297) % 233280;
    const j = Math.floor((estado / 233280) * (i + 1));
    const guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}
