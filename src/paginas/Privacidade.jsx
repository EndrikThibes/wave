import { Link } from "react-router-dom";
import BotaoTema from "../componentes/BotaoTema.jsx";
import { useTitulo } from "../servicos/useTitulo.js";

export default function Privacidade() {
  useTitulo("Termos e privacidade");

  return (
    <>
      <a className="pular-menu" href="#principal">
        Pular para o conteúdo
      </a>
      <header className="documento-topo">
        <Link to="/login" className="marca-topo">
          <img src={import.meta.env.BASE_URL + "img/wave-logo-pequeno.webp"} width="92" height="59" alt="" />
          Wave
        </Link>
        <BotaoTema />
      </header>
      <main id="principal" className="documento">
        <h1>Termos de uso e Política de privacidade</h1>
        <p className="dica">Versão acadêmica, atualizada em novembro de 2026.</p>
        <p>
          O Wave é um projeto da disciplina de Desenvolvimento de Interface de Usuário (UDESC Alto Vale). Este texto
          explica, em linguagem simples, como seus dados são tratados, seguindo os princípios da Lei Geral de Proteção
          de Dados (LGPD, Lei 13.709/2018).
        </p>

        <h2>Quais dados o Wave guarda</h2>
        <ul>
          <li>Nome, e-mail e gêneros musicais favoritos, informados por você no cadastro.</li>
          <li>Uma versão protegida da senha (hash com sal). A senha em si nunca é guardada.</li>
          <li>Suas músicas curtidas, playlists e histórico de reprodução.</li>
          <li>Preferências: tema claro ou escuro e volume do player.</li>
        </ul>

        <h2>Onde ficam os dados</h2>
        <p>
          Tudo fica apenas no armazenamento local (LocalStorage) do seu navegador, neste aparelho. O Wave não tem
          servidor, não envia seus dados a ninguém e não usa cookies de rastreamento ou de publicidade.
        </p>

        <h2>Uso sem conta e “Lembrar de mim”</h2>
        <p>
          Você pode usar o Wave como visitante. Nesse caso, curtidas e playlists ficam salvas neste navegador e podem
          ser levadas para uma conta se você se cadastrar depois. Se “Lembrar de mim” estiver desmarcado, a sessão
          termina quando você fecha a aba.
        </p>

        <h2>Para que usamos</h2>
        <p>
          Para criar sua conta, personalizar as recomendações da sua onda e lembrar suas preferências. A base legal é o
          seu consentimento, dado ao marcar o aceite no cadastro, e você pode retirá-lo a qualquer momento.
        </p>

        <h2>Reprodução de música</h2>
        <p>
          As músicas tocam pelo player do YouTube, incorporado ao Wave. O player só é carregado quando você aperta play
          e usa o endereço youtube-nocookie.com, que reduz o uso de cookies. Ao tocar uma música, o YouTube pode tratar
          dados conforme a política dele. Capas e fotos vêm de fontes públicas, como iTunes e Wikipédia.
        </p>

        <h2>Seus direitos</h2>
        <ul>
          <li>Acessar e levar seus dados: em Ajustes, use “Baixar meus dados”.</li>
          <li>Corrigir: altere seu nome e seus gêneros em Ajustes.</li>
          <li>Excluir: em Ajustes, “Excluir minha conta” apaga o perfil e a biblioteca deste navegador.</li>
        </ul>

        <h2>Contato</h2>
        <p>Dúvidas sobre o projeto: Endrik Thibes de Moraes Marschner e Domenik, UDESC Alto Vale.</p>
        <p>
          <Link to="/login">Voltar para o Wave</Link>
        </p>
      </main>
    </>
  );
}
