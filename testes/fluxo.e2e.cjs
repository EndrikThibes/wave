const { chromium } = require("playwright");

const base = process.env.ENDERECO || "http://localhost:4173";
let falhas = 0;

async function espera(teste, limite = 4000) {
  const inicio = Date.now();
  while (Date.now() - inicio < limite) {
    try {
      if (await teste()) {
        return true;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 50));
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

function conferir(resultado, nome) {
  console.log((resultado ? "OK    " : "FALHA ") + nome);
  if (!resultado) {
    falhas++;
  }
}

(async () => {
  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({ viewport: { width: 1366, height: 800 } });
  const p = await contexto.newPage();
  const erros = [];
  p.on("pageerror", (e) => erros.push(e.message));
  p.on("dialog", (d) => {
    erros.push("alert: " + d.message());
    d.dismiss();
  });

  await p.goto(base + "/cadastro");
  await p.getByRole("button", { name: /Continuar para os gêneros/ }).click();
  conferir(await espera(async () => (await p.getByRole("alert").count()) >= 1), "cadastro mostra erros na tela");
  await p.getByLabel("Como podemos te chamar?").fill("Maria");
  await p.getByLabel("E-mail").fill("maria@teste.com");
  await p.getByLabel("Senha", { exact: true }).fill("Wave1234");
  await p.getByLabel(/Confirmar/).fill("Wave1234");
  await p.getByRole("checkbox").check();
  await p.getByRole("button", { name: /Continuar para os gêneros/ }).click();
  for (const g of ["Pop", "Rock", "Jazz"]) {
    await p.getByRole("button", { name: g, exact: true }).click();
  }
  await p.getByRole("button", { name: /Concluir cadastro/ }).click();
  await p.getByRole("button", { name: /Ir para o Wave/ }).click();
  await p.waitForURL("**/inicio");
  conferir(await espera(async () => (await p.title()).startsWith("Início")), "título da aba muda por página");
  const usuarios = await p.evaluate(() => localStorage.getItem("wave:usuarios"));
  conferir(!usuarios.includes("Wave1234"), "senha não fica em texto puro");

  await p.goto(base + "/buscar?q=arctc%20monkys");
  conferir(await espera(async () => (await p.getByRole("heading", { name: "Melhor resultado" }).count()) === 1), "busca tolerante a erro de digitação");
  await p.goto(base + "/buscar?q=beat");
  await p.getByRole("button", { name: "Curtir Beat It" }).first().click();
  conferir(await espera(async () => (await p.getByText(/foi para Músicas curtidas/).count()) > 0), "curtir mostra aviso");
  await p.getByRole("button", { name: /Salvar Beat It em uma playlist/ }).first().click();
  await p.getByRole("button", { name: "Criar playlist" }).click();
  conferir(await espera(async () => (await p.getByText("Dê um nome para a playlist.").count()) > 0), "playlist sem nome mostra erro");
  await p.getByLabel("Nome da playlist").fill("Treino");
  await p.getByLabel(/Pública/).check();
  await p.getByRole("button", { name: "Criar playlist" }).click();
  await p.goto(base + "/biblioteca");
  await p.reload();
  conferir(await espera(async () => (await p.getByRole("link", { name: /Treino/ }).count()) === 1), "playlist continua após recarregar");
  conferir(await espera(async () => (await p.getByRole("button", { name: /Beat It/ }).count()) >= 1), "curtida continua após recarregar");
  await p.getByRole("link", { name: /Treino/ }).click();
  await p.getByRole("button", { name: /Remover Beat It/ }).click();
  await p.getByRole("button", { name: "Desfazer" }).click();
  conferir(await espera(async () => (await p.getByRole("button", { name: /Remover Beat It/ }).count()) === 1), "Desfazer devolve a música");
  await p.getByRole("button", { name: "Excluir playlist" }).first().click();
  conferir(await espera(async () => (await p.getByRole("heading", { name: "Excluir esta playlist?" }).count()) === 1), "excluir pede confirmação");
  await p.getByRole("button", { name: "Manter playlist" }).click();

  await p.goto(base + "/perfil");
  conferir(await espera(async () => (await p.getByText(/1 playlist · 1 pública/).count()) === 1), "perfil mostra playlists e quantas são públicas");
  await p.goto(base + "/planos");
  await p.getByRole("button", { name: "Assinar Duo" }).click();
  conferir(await espera(async () => (await p.getByRole("heading", { name: /Plano Duo ativado/ }).count()) === 1), "assinar plano leva à tela de sucesso");
  await p.goto(base + "/suporte");
  await p.getByRole("button", { name: "Enviar chamado" }).click();
  conferir(await espera(async () => (await p.getByText("Escolha um assunto.").count()) === 1), "chamado vazio mostra erro");
  await p.getByLabel("Assunto").selectOption("Conta e login");
  await p.getByLabel("Descrição").fill("Não consigo trocar minha senha.");
  await p.getByRole("button", { name: "Enviar chamado" }).click();
  conferir(await espera(async () => (await p.getByText(/Conta e login/).count()) >= 1), "chamado aberto aparece na lista");
  await p.goto(base + "/configuracoes");
  conferir(await espera(async () => (await p.getByText("Duo", { exact: true }).count()) >= 1), "configurações mostram o plano atual");
  await p.getByRole("button", { name: /Mudar para o tema claro|tema claro/i }).first().click();
  await p.reload();
  conferir(await espera(async () => (await p.evaluate(() => document.documentElement.dataset.theme)) === "light"), "tema claro continua após recarregar");

  await p.getByRole("button", { name: "Sair da conta" }).first().click();
  await p.waitForURL("**/login");
  await p.getByLabel("E-mail").fill("maria@teste.com");
  await p.getByLabel("Senha", { exact: true }).fill("errada123");
  await p.getByRole("button", { name: /Entrar na conta/ }).click();
  conferir(await espera(async () => (await p.getByText(/incorretos/).count()) > 0), "senha errada mostra mensagem");
  await p.getByLabel("Senha", { exact: true }).fill("Wave1234");
  await p.getByRole("checkbox").uncheck();
  await p.getByRole("button", { name: /Entrar na conta/ }).click();
  await p.waitForURL("**/inicio");
  conferir((await p.evaluate(() => localStorage.getItem("wave:sessao"))) === null, "sem Lembrar de mim a sessão não fica salva");

  await p.goto(base + "/rota-que-nao-existe");
  conferir(await espera(async () => (await p.getByRole("heading", { name: "Página não encontrada" }).count()) === 1), "página 404");

  await p.setViewportSize({ width: 320, height: 700 });
  for (const rota of ["/inicio", "/buscar", "/biblioteca", "/perfil", "/configuracoes", "/planos", "/suporte", "/artista/djavan"]) {
    await p.goto(base + rota);
    await p.waitForTimeout(400);
    const vaza = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    conferir(!vaza, "320 px sem rolagem horizontal em " + rota);
  }
  await p.setViewportSize({ width: 1366, height: 800 });

  await p.goto(base + "/configuracoes");
  await p.getByRole("button", { name: "Excluir minha conta" }).click();
  await p.getByRole("button", { name: /Excluir conta para sempre/ }).click();
  await p.waitForURL("**/login");
  const resto = await p.evaluate(() => JSON.parse(localStorage.getItem("wave:usuarios") || "[]"));
  conferir(resto.length === 0, "conta excluída some do LocalStorage");
  conferir(erros.length === 0, "sem erros de JavaScript e sem alert() " + erros.join(" | "));

  await navegador.close();
  console.log(falhas === 0 ? "TUDO OK" : falhas + " falha(s)");
  process.exit(falhas === 0 ? 0 : 1);
})();
