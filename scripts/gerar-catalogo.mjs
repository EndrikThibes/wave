import { readFileSync, writeFileSync } from "node:fs";

const ITUNES = "https://is1-ssl.mzstatic.com/image/thumb/";
const WIKI = "https://upload.wikimedia.org/wikipedia/commons/thumb/";

const artistas = [
  {
    id: "michael-jackson", nome: "Michael Jackson", generos: ["Pop"],
    foto: WIKI + "b/b9/Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg/500px-Michael_Jackson_1983_%283x4_cropped%29_%28contrast%29.jpg",
    bio: "Cantor, compositor e dançarino norte-americano, conhecido como o Rei do Pop. Thriller, de 1982, é um dos discos mais vendidos da história."
  },
  {
    id: "queen", nome: "Queen", generos: ["Rock"],
    foto: WIKI + "e/ec/Queen_A_Night_At_The_Opera_%281975_Elektra_publicity_photo_02%29.jpg/500px-Queen_A_Night_At_The_Opera_%281975_Elektra_publicity_photo_02%29.jpg",
    bio: "Banda britânica formada em Londres em 1970, com Freddie Mercury, Brian May, Roger Taylor e John Deacon. Mistura rock, ópera e muito show."
  },
  {
    id: "daft-punk", nome: "Daft Punk", generos: ["Eletrônica"],
    foto: WIKI + "d/db/Daft_Punk_in_2013.jpg/500px-Daft_Punk_in_2013.jpg",
    bio: "Dupla francesa de música eletrônica, formada em Paris em 1993. Ficou famosa pelos capacetes de robô e por levar o french house para o mundo."
  },
  {
    id: "nujabes", nome: "Nujabes", generos: ["Lo-Fi", "Hip Hop"],
    foto: "img/artistas/nujabes.webp",
    bio: "Produtor e DJ japonês que misturou jazz e hip hop em batidas calmas. Suas músicas viraram trilha para estudar, e uma delas abre o anime Samurai Champloo."
  },
  {
    id: "emicida", nome: "Emicida", generos: ["Hip Hop"],
    foto: WIKI + "1/16/Emicida_Festival_Sensacional_2020_%28cropped%29.jpg/500px-Emicida_Festival_Sensacional_2020_%28cropped%29.jpg",
    bio: "Rapper, cantor e compositor paulistano. Une rima, samba e crônica social, e é um dos nomes mais importantes do hip hop brasileiro."
  },
  {
    id: "marilia-mendonca", nome: "Marília Mendonça", generos: ["Sertanejo"],
    foto: WIKI + "c/c7/Marilia_Mendonca_Pecuaria_de_Goiania_2018_2.jpg/500px-Marilia_Mendonca_Pecuaria_de_Goiania_2018_2.jpg",
    bio: "Cantora e compositora goiana, a Rainha da Sofrência. Escreveu sucessos para outros artistas antes de virar uma das maiores vozes do sertanejo."
  },
  {
    id: "djavan", nome: "Djavan", generos: ["MPB"],
    foto: WIKI + "0/08/Djavan_San_Javier_Jazz_2023_26_%28cropped%29.jpg/500px-Djavan_San_Javier_Jazz_2023_26_%28cropped%29.jpg",
    bio: "Cantor, compositor e violonista alagoano. Seu estilo mistura MPB, jazz e ritmos brasileiros, com letras cheias de imagens do mar e do amor."
  },
  {
    id: "anitta", nome: "Anitta", generos: ["Pop", "Funk"],
    foto: WIKI + "b/b6/27th_Latin_GRAMMY_Awards_-_Red_Carpet_0163-_Anitta_%28cropped%29.jpg/500px-27th_Latin_GRAMMY_Awards_-_Red_Carpet_0163-_Anitta_%28cropped%29.jpg",
    bio: "Cantora e empresária carioca. Começou no funk e levou o pop brasileiro para o mundo, cantando em português, inglês e espanhol."
  },
  {
    id: "miles-davis", nome: "Miles Davis", generos: ["Jazz"],
    foto: WIKI + "2/24/Miles_Davis_by_Palumbo_cropped.jpg/500px-Miles_Davis_by_Palumbo_cropped.jpg",
    bio: "Trompetista e compositor norte-americano, uma das figuras mais influentes do jazz. Kind of Blue, de 1959, é um dos discos de jazz mais vendidos de todos os tempos."
  },
  {
    id: "arctic-monkeys", nome: "Arctic Monkeys", generos: ["Indie", "Rock"],
    foto: WIKI + "0/04/Arctic_Monkeys_-_Orange_Stage_-_Roskilde_Festival_2014.jpg/500px-Arctic_Monkeys_-_Orange_Stage_-_Roskilde_Festival_2014.jpg",
    bio: "Banda de rock indie de Sheffield, na Inglaterra, liderada por Alex Turner. Ficou conhecida cedo, quando suas músicas se espalharam pela internet."
  },
  {
    id: "beethoven", nome: "Ludwig van Beethoven", generos: ["Clássica"],
    foto: WIKI + "6/6f/Beethoven.jpg/500px-Beethoven.jpg",
    bio: "Compositor e pianista alemão do século XIX, ponte entre o classicismo e o romantismo. Seguiu compondo obras-primas mesmo depois de ficar surdo."
  },
  {
    id: "bob-marley", nome: "Bob Marley", generos: ["Reggae"],
    foto: WIKI + "2/2d/Bob_Marley_1976_press_photo.jpg/500px-Bob_Marley_1976_press_photo.jpg",
    bio: "Cantor e compositor jamaicano, o maior nome do reggae. Suas músicas falam de paz, união e esperança e são cantadas no mundo todo."
  }
];

const C = {
  thriller: "Music115/v4/32/4f/fd/324ffda2-9e51-8f6a-0c2d-c6fd2b41ac55/074643811224.jpg",
  essentialMj: "Music125/v4/3d/9d/38/3d9d3811-71f0-3a0e-1ada-3004e56ff852/827969428726.jpg",
  bohemian: "Music221/v4/62/2e/97/622e97c4-d620-2ae1-2a47-a32e16a01492/602567988847.jpg",
  jazzQueen: "Music221/v4/9e/ae/4a/9eae4a23-130a-4ed7-d590-bfa701f9acaf/602527717685.jpg",
  platinum: "Music221/v4/15/c7/55/15c755bc-7603-3ce3-e243-e59f1f9863ea/602527724171.jpg",
  discovery: "Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg",
  getLucky: "Music125/v4/1c/da/5a/1cda5a7d-90ad-8643-efb2-7641afb13418/886443973442.jpg",
  homework: "Features115/v4/34/8d/c7/348dc71c-d75e-9baf-671a-994e9e74b018/dj.pimdxdmf.jpg",
  feather: "Music125/v4/ad/18/6b/ad186b39-cd19-fa4d-abe0-bf6860cd8d9d/POCS-30003_jkt.jpg",
  champloo: "Music116/v4/be/59/2b/be592b54-496f-bd59-9e46-49fa2f45a717/VICL-61411.jpg",
  luv: "Music124/v4/cf/cb/2b/cfcb2b72-c7a5-b4af-e227-46d341a3e3f2/Luv_sic_Hexjaket.jpg",
  modal: "Music125/v4/79/7e/a1/797ea11f-b90c-c4c5-f874-6a6ccd2c22a7/HPD5.jpg",
  amarelo: "Music113/v4/fa/31/c9/fa31c924-89f5-233a-a0aa-fcec6d84e77f/886447809419.jpg",
  sobreCriancas: "Music113/v4/28/e0/1e/28e01e52-cac3-145b-07a4-b1d986bf80ad/193483923642.jpg",
  passarinhos: "Music123/v4/b4/19/d4/b419d426-d6d7-023f-b2e0-af82489756a0/193483859767.jpg",
  infiel: "Music114/v4/1e/68/40/1e684061-025d-60a4-28d6-16cb4e0b37b7/7891430399023.jpg",
  supera: "Music113/v4/28/88/8a/28888ad9-7027-56d0-2094-66c5c8e91021/7891430413873.jpg",
  todoMundo: "Music113/v4/02/50/58/025058b0-d15e-041e-7b27-f88705e44c14/7891430385873.jpg",
  euSeiDeCor: "Music124/v4/9f/1b/6b/9f1b6b0e-3ff7-d727-f79a-46d35e59d8f9/7891430121877.jpg",
  djavan: "Music6/v4/56/8e/30/568e3096-1a3d-2822-2a47-ebaa47d59752/884977966497.jpg",
  voz: "Music3/v4/fd/23/3d/fd233dfa-51de-4111-a063-25e3fe51c56b/dj.vzveqtxn.jpg",
  luz: "Music124/v4/a1/7e/31/a17e31a0-1969-6d81-4e6c-6eb4e9492d73/5099747630224.jpg",
  coisa: "Music114/v4/3d/7c/53/3d7c53c9-ae35-7209-52a5-fe524cc533f8/884977966381.jpg",
  malandra: "Music125/v4/3d/11/25/3d1125ea-a6c7-9baa-02aa-bf772033493a/190296939372.jpg",
  anitta: "Music4/v4/d2/b7/f3/d2b7f329-e79f-33ea-7d0a-1bfa5c245e18/825646428915.jpg",
  bang: "Music115/v4/25/82/b1/2582b1a7-0982-7daa-9c07-565b524b7170/825646005178.jpg",
  envolver: "Music126/v4/c5/ba/2b/c5ba2b96-ff06-5f58-35ad-1c070973cee7/190296362989.jpg",
  kindOfBlue: "Features125/v4/8c/41/ef/8c41efae-a00f-84cf-9d6f-465bb0fc2f66/dj.aacpwrsd.jpg",
  am: "Music211/v4/69/9c/b5/699cb5d6-115c-ff73-9d26-e57ea4350d72/887828031795.png",
  amLive: "Music125/v4/29/f5/6f/29f56fb2-4735-947b-f63a-2801294719cb/am_am_itunes_bonus_v2.jpg",
  fwn: "Music115/v4/1f/46/84/1f468438-c8ff-6c7c-d790-7d9ad31a55b6/dj.ofwxjvjm.jpg",
  amHigh: "Music211/v4/a1/ed/a7/a1eda740-f49a-fd6e-9fb1-d38f49f606cf/887828049066.png",
  brendel: "Music126/v4/df/70/04/df700435-0f23-c5d2-48b6-15cc7d37dbfa/06UMGIM37915.rgb.jpg",
  ott: "Music116/v4/21/66/e8/2166e8dd-ceb9-8d5f-8726-c08550be2b22/15UMGIM07859.rgb.jpg",
  karajan: "Music118/v4/94/58/f2/9458f2e8-ea9d-b384-6a52-6d976d5ebc9c/00028943900423.rgb.jpg",
  koussevitzky9: "Music221/v4/ed/59/49/ed594956-37ab-bc8c-2a12-72a7041e7eb0/196874232804.jpg",
  legend: "Music221/v4/3c/c2/0d/3cc20dcc-8f4e-f060-36dd-7de52a7ec8fe/12UMGIM14712.rgb.jpg",
  kaya: "Music116/v4/52/1a/d4/521ad4e3-9c00-39ad-b5ae-6fc2f144bf98/06UMGIM11277.rgb.jpg"
};

const f = (id, titulo, artistaId, album, genero, duracao, capa, video) => ({
  id, titulo, artistaId, album, genero, duracao, capa: ITUNES + C[capa], video
});

const faixas = [
  f("mj-beat-it", "Beat It", "michael-jackson", "Thriller", "Pop", 258, "thriller", ["oRdxUFDoQe0", "kOn-HdEg6AQ"]),
  f("mj-billie-jean", "Billie Jean", "michael-jackson", "Thriller", "Pop", 294, "thriller", ["Zi_XLOBDo_Y", "Kr4EQDVETuA"]),
  f("mj-thriller", "Thriller", "michael-jackson", "Thriller", "Pop", 358, "thriller", ["BIBpeA1szPM", "sOnqjkJTMaA"]),
  f("mj-smooth-criminal", "Smooth Criminal", "michael-jackson", "The Essential Michael Jackson", "Pop", 259, "essentialMj", ["_mMyPJSx8RU", "h_D3VFfhvs4"]),

  f("queen-bohemian-rhapsody", "Bohemian Rhapsody", "queen", "Bohemian Rhapsody (Trilha Sonora)", "Rock", 355, "bohemian", ["fJ9rUzIMcZQ", "LlPcnOjSByU"]),
  f("queen-dont-stop-me-now", "Don't Stop Me Now", "queen", "Jazz", "Rock", 210, "jazzQueen", ["HgzGwKwLmgM", "MHi9mKq0slA"]),
  f("queen-another-one", "Another One Bites the Dust", "queen", "Bohemian Rhapsody (Trilha Sonora)", "Rock", 215, "bohemian", ["rY0WxgSXdEE", "OdurVND-DSs"]),
  f("queen-under-pressure", "Under Pressure", "queen", "The Platinum Collection", "Rock", 237, "platinum", ["a01QQZyl-_I", "nbwn21TU4ec"]),

  f("daft-one-more-time", "One More Time", "daft-punk", "Discovery", "Eletrônica", 320, "discovery", ["FGBhQbmPwH8", "A2VpR8HahKc"]),
  f("daft-harder-better", "Harder, Better, Faster, Stronger", "daft-punk", "Discovery", "Eletrônica", 225, "discovery", ["gAjR4_CbPpQ", "yydNF8tuVmU"]),
  f("daft-get-lucky", "Get Lucky", "daft-punk", "Get Lucky (Radio Edit)", "Eletrônica", 248, "getLucky", ["5NV6Rdv1a3I"]),
  f("daft-around-the-world", "Around the World", "daft-punk", "Homework", "Eletrônica", 430, "homework", ["K0HSD_i2DvA", "dwDns8x3Jb4"]),

  f("nujabes-feather", "Feather", "nujabes", "Kei Nishikori meets Nujabes", "Lo-Fi", 176, "feather", ["hQ5x8pHoIPA", "jfFTT3iz740"]),
  f("nujabes-aruarian-dance", "Aruarian Dance", "nujabes", "Samurai Champloo Music Record: Departure", "Lo-Fi", 250, "champloo", ["qYcoJpqCha4", "HkZ8BitJhvc"]),
  f("nujabes-luv-sic-3", "Luv(sic) Pt. 3", "nujabes", "Luv(sic) Hexalogy", "Hip Hop", 374, "luv", ["Fwv2gnCFDOc", "mc_xD6aGV5w"]),
  f("nujabes-reflection-eternal", "Reflection Eternal", "nujabes", "Modal Soul", "Lo-Fi", 258, "modal", ["2wK27xW4OFI", "GLGM8fxL020"]),

  f("emicida-amarelo", "AmarElo", "emicida", "AmarElo", "Hip Hop", 321, "amarelo", ["uJcjV6g5mV8", "91bikd4bWOs"]),
  f("emicida-boa-esperanca", "Boa Esperança", "emicida", "Sobre Crianças, Quadris, Pesadelos e Lições de Casa...", "Hip Hop", 183, "sobreCriancas", ["s96Xp0EmfDw", "Qa4EzzCzkuc"]),
  f("emicida-passarinhos", "Passarinhos", "emicida", "Sobre Crianças, Quadris, Pesadelos e Lições de Casa...", "Hip Hop", 222, "passarinhos", ["JwQXW7fNeV8", "IJcmLHjjAJ4"]),
  f("emicida-mufete", "Mufete", "emicida", "Sobre Crianças, Quadris, Pesadelos e Lições de Casa...", "Hip Hop", 239, "sobreCriancas", ["zypOpcW62T8", "0EldFej_bKg"]),

  f("marilia-infiel", "Infiel", "marilia-mendonca", "Marília Mendonça (Ao Vivo)", "Sertanejo", 202, "infiel", ["eCyMh-mZ1B0", "lWv-Mm8xKig"]),
  f("marilia-supera", "Supera", "marilia-mendonca", "Todos os Cantos, Vol. 3 (Ao Vivo)", "Sertanejo", 148, "supera", ["7fMttPxpcmg"]),
  f("marilia-todo-mundo-vai-sofrer", "Todo Mundo Vai Sofrer", "marilia-mendonca", "Todos os Cantos, Vol. 2 (Ao Vivo)", "Sertanejo", 155, "todoMundo", ["ILADw1aretk", "aDSYWns0mfY"]),
  f("marilia-eu-sei-de-cor", "Eu Sei de Cor", "marilia-mendonca", "Agora É Que São Elas (Acústico)", "Sertanejo", 175, "euSeiDeCor", ["2QTCKfVN1ZE", "N1uym-QODZk"]),

  f("djavan-oceano", "Oceano", "djavan", "Djavan", "MPB", 296, "djavan", ["P-lxOj0XpEE", "MWh78SM5G7k"]),
  f("djavan-flor-de-lis", "Flor de Lis", "djavan", "A Voz e o Violão", "MPB", 225, "voz", ["k55L6LGS_Ns", "peR8eOcGA3M"]),
  f("djavan-sina", "Sina", "djavan", "Luz", "MPB", 332, "luz", ["5siQ-ml5lqY", "Kh5xptrsbi4"]),
  f("djavan-se", "Se...", "djavan", "Coisa de Acender", "MPB", 292, "coisa", ["pn4FYf8lRpo", "ZSZyth38-zk"]),

  f("anitta-vai-malandra", "Vai Malandra", "anitta", "Vai Malandra (Single)", "Funk", 202, "malandra", ["kDhptBT_-VI"]),
  f("anitta-show-das-poderosas", "Show das Poderosas", "anitta", "Anitta", "Funk", 151, "anitta", ["FGViL3CYRwg", "YWFCcltlH4U"]),
  f("anitta-bang", "Bang", "anitta", "Bang", "Pop", 191, "bang", ["UGov-KH7hkM", "45-Dbpo_D-U"]),
  f("anitta-envolver", "Envolver", "anitta", "Envolver (Single)", "Pop", 194, "envolver", ["hFCjGiawJi4"]),

  f("miles-so-what", "So What", "miles-davis", "Kind of Blue", "Jazz", 563, "kindOfBlue", ["ylXk1LBvIqU", "zqNTltOGh5c"]),
  f("miles-blue-in-green", "Blue in Green", "miles-davis", "Kind of Blue", "Jazz", 338, "kindOfBlue", ["TLDflhhdPCg", "btg4BREPFto"]),
  f("miles-all-blues", "All Blues", "miles-davis", "Kind of Blue", "Jazz", 693, "kindOfBlue", ["-488UORrfJ0"]),
  f("miles-freddie-freeloader", "Freddie Freeloader", "miles-davis", "Kind of Blue", "Jazz", 586, "kindOfBlue", ["ZZcuSBouhVA", "F-SuJ3bLkLI"]),

  f("arctic-do-i-wanna-know", "Do I Wanna Know?", "arctic-monkeys", "AM", "Indie", 272, "am", ["bpOSxM0rNPM", "1tWFk8ojF4M"]),
  f("arctic-r-u-mine", "R U Mine?", "arctic-monkeys", "AM", "Indie", 202, "amLive", ["VQH8ZTgna3Q", "voH0S0e01vs"]),
  f("arctic-505", "505", "arctic-monkeys", "Favourite Worst Nightmare", "Indie", 254, "fwn", ["CKI8iQTgZKU", "MrmPDUvKyLs"]),
  f("arctic-why-youd-only-call-me", "Why'd You Only Call Me When You're High?", "arctic-monkeys", "AM", "Rock", 161, "amHigh", ["6366dxFf-Os", "XdAMCngf9uY"]),

  f("beethoven-fur-elise", "Für Elise", "beethoven", "Beethoven: Für Elise", "Clássica", 217, "brendel", ["PtwFOOOoGlo", "htkFIckCFqs"]),
  f("beethoven-moonlight", "Sonata ao Luar (1º movimento)", "beethoven", "Piano Sonatas", "Clássica", 445, "ott", ["sbTVZMJ9Z2I", "5GOE3w2ZUrQ"]),
  f("beethoven-sinfonia-5", "Sinfonia nº 5 (1º movimento)", "beethoven", "Sinfonias nº 5 e 6", "Clássica", 442, "karajan", ["LibOP5yt0TY", "9aDEq3u5huA"]),
  f("beethoven-sinfonia-9", "Sinfonia nº 9 (Ode à Alegria)", "beethoven", "Sinfonia nº 9", "Clássica", 1437, "koussevitzky9", ["fzyO3fLV5O0", "-kcOpyM9cBg"]),

  f("marley-three-little-birds", "Three Little Birds", "bob-marley", "Legend", "Reggae", 181, "legend", ["HNBCVM4KbUM", "NOyRsPDPfMM"]),
  f("marley-one-love", "One Love / People Get Ready", "bob-marley", "Legend", "Reggae", 172, "legend", ["IN0KkGeEURw", "0Tgl0Ok2Pjg"]),
  f("marley-is-this-love", "Is This Love", "bob-marley", "Kaya", "Reggae", 232, "kaya", ["69RdQFDuYPI", "co2FK0WbXX0"]),
  f("marley-redemption-song", "Redemption Song", "bob-marley", "Legend", "Reggae", 227, "legend", ["yv5xonFSC4c"])
];

const lerJson = (nome) => JSON.parse(readFileSync(new URL(nome, import.meta.url), "utf8"));
const novos = lerJson("./novos-artistas.json");
const bios = lerJson("./bios.json");
const videos = lerJson("./videos-novos.json");

const slug = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function limparAlbum(nome) {
  let tipo = "Álbum";
  let titulo = nome;
  if (/ - Single$/.test(titulo) || /\(Single\)$/.test(titulo)) {
    tipo = "Single";
  } else if (/ - EP$/.test(titulo)) {
    tipo = "EP";
  }
  titulo = titulo
    .replace(/ - (Single|EP)$/, "")
    .replace(/ \(Single\)$/, "")
    .replace(/ - The Paradise Edition$/, "")
    .replace(/ \((Deluxe Edition|Deluxe|Deluxe Version|Bonus Tracks Edition|Edição Comemorativa)\)/g, "");
  return { titulo, tipo };
}

const albuns = new Map();

function registrarAlbum(artistaId, nomeAlbum, ano, capa, genero) {
  const { titulo, tipo } = limparAlbum(nomeAlbum);
  const id = slug(artistaId + " " + titulo);
  if (!albuns.has(id)) {
    albuns.set(id, { id, titulo, artistaId, ano, tipo, capa, genero });
  }
  return { id, titulo };
}

const FOTOS_LOCAIS = ["matue", "teto", "ferrugem", "sabotage"];

for (const faixa of faixas) {
  const album = registrarAlbum(faixa.artistaId, faixa.album, "", faixa.capa, faixa.genero);
  faixa.albumId = album.id;
  faixa.album = album.titulo;
}

let indice = 0;
for (const [artistaId, nome, genero, foto, lista] of novos) {
  const capaPrincipal = ITUNES + lista[0][4];
  const arquivo = foto ? foto.split("/").pop() : "";
  artistas.push({
    id: artistaId,
    nome,
    generos: [genero],
    foto: FOTOS_LOCAIS.includes(artistaId)
      ? "img/artistas/" + artistaId + ".webp"
      : foto
        ? WIKI + foto + "/500px-" + arquivo
        : capaPrincipal + "/600x600bb.jpg",
    bio: bios[artistaId]
  });
  for (const [titulo, nomeAlbum, ano, duracao, capa] of lista) {
    const ids = videos[indice] || [];
    indice++;
    if (ids.length === 0) {
      continue;
    }
    const album = registrarAlbum(artistaId, nomeAlbum, ano, ITUNES + capa, genero);
    faixas.push({
      id: slug(artistaId + " " + titulo),
      titulo,
      artistaId,
      album: album.titulo,
      albumId: album.id,
      genero,
      duracao,
      capa: ITUNES + capa,
      video: ids
    });
  }
}

const dados = { artistas, albuns: [...albuns.values()], faixas };
writeFileSync(new URL("../src/dados/catalogo.json", import.meta.url), JSON.stringify(dados));
console.log(artistas.length + " artistas, " + dados.albuns.length + " álbuns, " + faixas.length + " faixas");
