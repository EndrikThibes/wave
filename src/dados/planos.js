export const PLANOS = [
  {
    id: "gratis",
    nome: "Grátis",
    preco: 0,
    contas: "1 conta",
    destaque: "Para conhecer o Wave",
    recursos: ["Todo o catálogo", "Playlists e músicas curtidas", "Ondas e Sua onda"]
  },
  {
    id: "universitario",
    nome: "Universitário",
    preco: 6.9,
    contas: "1 conta",
    destaque: "Para quem estuda",
    recursos: ["Tudo do Grátis", "Sem anúncios", "Ouça sem internet", "Desconto para estudantes"]
  },
  {
    id: "individual",
    nome: "Individual",
    preco: 12.9,
    contas: "1 conta",
    destaque: "O mais escolhido",
    recursos: ["Tudo do Grátis", "Sem anúncios", "Ouça sem internet", "Qualidade de som alta"]
  },
  {
    id: "duo",
    nome: "Duo",
    preco: 17.9,
    contas: "2 contas",
    destaque: "Para casais e duplas",
    recursos: ["Tudo do Individual", "2 contas Premium", "Playlist em dupla"]
  },
  {
    id: "familia",
    nome: "Família",
    preco: 22.9,
    contas: "Até 6 contas",
    destaque: "Para a casa toda",
    recursos: ["Tudo do Individual", "Até 6 contas Premium", "Controle para crianças"]
  }
];

export function planoPorId(id) {
  return PLANOS.find((plano) => plano.id === id) || PLANOS[0];
}

export function formatarPreco(valor) {
  if (valor === 0) {
    return "R$ 0";
  }
  return "R$ " + valor.toFixed(2).replace(".", ",");
}
