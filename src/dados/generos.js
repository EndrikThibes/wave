export const GENEROS = [
  { nome: "Pop", cor: "#ff4d8d" },
  { nome: "Rock", cor: "#ff6b3d" },
  { nome: "Eletrônica", cor: "#22d3ff" },
  { nome: "Lo-Fi", cor: "#8b7bff" },
  { nome: "Hip Hop", cor: "#f5b82e" },
  { nome: "Sertanejo", cor: "#c28a4a" },
  { nome: "MPB", cor: "#2fbf71" },
  { nome: "Funk", cor: "#ff3d6e" },
  { nome: "Jazz", cor: "#3b82f6" },
  { nome: "Indie", cor: "#14b8a6" },
  { nome: "Clássica", cor: "#a78bfa" },
  { nome: "Reggae", cor: "#84cc16" }
];

export function corDoGenero(nome) {
  const genero = GENEROS.find((g) => g.nome === nome);
  return genero ? genero.cor : "#2459ee";
}

export const ONDAS = [
  {
    id: "foco",
    nome: "Foco",
    descricao: "Para estudar e programar sem distração",
    generos: ["Lo-Fi", "Clássica", "Jazz"],
    cores: ["#1f4bd1", "#22d3ff"]
  },
  {
    id: "energia",
    nome: "Energia",
    descricao: "Para treinar e levantar o astral",
    generos: ["Rock", "Funk", "Eletrônica"],
    cores: ["#ff3d6e", "#f5b82e"]
  },
  {
    id: "calma",
    nome: "Calma",
    descricao: "Para desacelerar no fim do dia",
    generos: ["MPB", "Reggae", "Sertanejo"],
    cores: ["#14b8a6", "#84cc16"]
  },
  {
    id: "rua",
    nome: "Rua",
    descricao: "Batida forte e letra afiada",
    generos: ["Hip Hop", "Pop", "Indie"],
    cores: ["#8b7bff", "#ff4d8d"]
  }
];
