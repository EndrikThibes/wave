const NOMES = ["Conta", "Gêneros", "Pronto"];

export default function Passos({ atual }) {
  return (
    <ol className="passos" aria-label="Etapas do cadastro">
      {NOMES.map((nome, posicao) => {
        const numero = posicao + 1;
        let classe = "passo";
        if (numero === atual) {
          classe = "passo atual";
        } else if (numero < atual) {
          classe = "passo feito";
        }
        return (
          <li key={nome} className="passo-item">
            <span className={classe} aria-current={numero === atual ? "step" : undefined}>
              <span className="passo-bolinha">{numero}</span>
              <span className="passo-nome">{nome}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
