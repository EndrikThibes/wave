export function ler(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave);
    if (texto === null) {
      return padrao;
    }
    return JSON.parse(texto);
  } catch {
    return padrao;
  }
}

export function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function remover(chave) {
  try {
    localStorage.removeItem(chave);
  } catch {
    return;
  }
}

export function lerTexto(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravarTexto(chave, texto) {
  try {
    localStorage.setItem(chave, texto);
  } catch {
    return;
  }
}

export function lerSessaoTemporaria(chave) {
  try {
    return sessionStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravarSessaoTemporaria(chave, texto) {
  try {
    sessionStorage.setItem(chave, texto);
  } catch {
    return;
  }
}

export function removerSessaoTemporaria(chave) {
  try {
    sessionStorage.removeItem(chave);
  } catch {
    return;
  }
}
