function criarSal() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function hashSimples(texto) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}

export async function gerarHash(senha, sal) {
  const texto = sal + ":" + senha;
  if (window.crypto && window.crypto.subtle) {
    const bytes = new TextEncoder().encode(texto);
    const resumo = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(resumo), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return hashSimples(texto);
}

export async function protegerSenha(senha) {
  const sal = criarSal();
  const hash = await gerarHash(senha, sal);
  return { sal, hash };
}

export async function conferirSenha(senha, sal, hash) {
  const novoHash = await gerarHash(senha, sal);
  return novoHash === hash;
}

export function calcularForca(senha) {
  let pontos = 0;
  if (senha.length >= 8) {
    pontos = pontos + 1;
  }
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) {
    pontos = pontos + 1;
  }
  if (/[0-9]/.test(senha)) {
    pontos = pontos + 1;
  }
  if (/[^A-Za-z0-9]/.test(senha)) {
    pontos = pontos + 1;
  }
  if (pontos === 0) {
    pontos = 1;
  }
  return pontos;
}
