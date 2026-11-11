import type { Metadata } from "next";
import { LegalPage } from "@/app/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Política de privacidade | ReportFlow" };

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de privacidade">
      <p>
        Esta política explica como o {LEGAL.productName} trata dados pessoais, em linha com a Lei Geral de Proteção de
        Dados (LGPD, Lei 13.709/2018).
      </p>

      <h2>1. Quem é o responsável</h2>
      <p>
        {LEGAL.operatorName} ({LEGAL.operatorDocument}) é o controlador dos dados da sua conta e do uso do serviço.
        Canal de contato para assuntos de privacidade: {LEGAL.contactEmail}.
      </p>
      <p>
        Sobre os dados de campanhas dos clientes da sua agência, a sua agência define para que eles são usados
        (é a controladora) e nós os tratamos em seu nome, para gerar os relatórios (somos operadores).
      </p>

      <h2>2. Dados que tratamos</h2>
      <ul>
        <li>
          <b>Conta:</b> nome, e-mail e foto do seu perfil Google, e identificadores técnicos de autenticação (incluindo
          tokens de login).
        </li>
        <li>
          <b>Agência e clientes:</b> nome da agência e nomes dos clientes que você cadastra.
        </li>
        <li>
          <b>Integrações:</b> identificador e nome das contas de anúncios conectadas e os tokens de acesso a elas.
          Esses tokens são armazenados criptografados.
        </li>
        <li>
          <b>Métricas e relatórios:</b> investimento, leads e custo por lead do período escolhido, além do texto da
          análise gerada.
        </li>
        <li>
          <b>Assinatura:</b> plano, status da assinatura e identificadores do Stripe. Os dados do cartão ficam com o
          Stripe; não os recebemos.
        </li>
        <li>
          <b>Dados técnicos:</b> cookie de sessão, necessário para manter você logado, e registros de erro do servidor.
        </li>
      </ul>

      <h2>3. Para que usamos e em qual base legal</h2>
      <ul>
        <li>Criar sua conta, coletar métricas e gerar relatórios (execução do contrato).</li>
        <li>Cobrar a assinatura e emitir registros financeiros (execução do contrato e obrigação legal).</li>
        <li>Manter a segurança, prevenir fraudes e corrigir falhas (legítimo interesse).</li>
        <li>Responder a pedidos seu e cumprir obrigações legais (obrigação legal e exercício regular de direitos).</li>
      </ul>
      <p>Não vendemos dados pessoais nem os usamos para publicidade de terceiros.</p>

      <h2>4. Com quem compartilhamos</h2>
      <p>Usamos prestadores que tratam dados em nosso nome, apenas para o necessário:</p>
      <ul>
        <li><b>Google e Meta:</b> login com Google e leitura das contas de anúncios que você autorizar.</li>
        <li>
          <b>Anthropic:</b> para gerar a análise de IA, enviamos o nome do cliente, o período e as métricas
          (investimento, leads e custo por lead).
        </li>
        <li><b>Stripe:</b> processamento de pagamentos.</li>
        <li><b>Vercel e provedor de banco de dados PostgreSQL:</b> hospedagem da aplicação e armazenamento.</li>
        <li>Autoridades, quando houver obrigação legal ou ordem judicial.</li>
      </ul>
      <p>
        Alguns desses prestadores estão fora do Brasil. Nesses casos, a transferência internacional segue a LGPD,
        com garantias contratuais dos prestadores.
      </p>

      <h2>5. Por quanto tempo guardamos</h2>
      <p>
        Mantemos seus dados enquanto sua conta estiver ativa. Ao excluir a conta, removemos os dados da plataforma;
        podem permanecer por mais tempo apenas registros que a lei exija guardar (como os financeiros, no Stripe) e
        cópias de segurança, até o ciclo normal de descarte. Ao desconectar uma integração, o token de acesso
        correspondente é apagado.
      </p>

      <h2>6. Seus direitos</h2>
      <p>Pela LGPD, você pode pedir a qualquer momento:</p>
      <ul>
        <li>confirmação de que tratamos seus dados e acesso a eles;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desacordo com a lei;</li>
        <li>portabilidade dos dados;</li>
        <li>informação sobre com quem compartilhamos seus dados;</li>
        <li>revogação do consentimento, quando essa for a base legal, e eliminação dos dados tratados com ele.</li>
      </ul>
      <p>
        Você pode excluir sua conta em Configurações. Para os demais pedidos, escreva para {LEGAL.contactEmail}.
        Também é possível reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
      </p>

      <h2>7. Segurança</h2>
      <p>
        Adotamos medidas como conexão criptografada (HTTPS), tokens de integração criptografados no banco de dados e
        acesso restrito aos dados de cada agência. Nenhum sistema é totalmente imune a incidentes; se ocorrer um que
        possa gerar risco relevante a você, comunicaremos você e a ANPD conforme a lei.
      </p>

      <h2>8. Cookies e serviços de terceiros</h2>
      <p>
        Usamos um cookie de sessão essencial para o login. Não usamos cookies de publicidade. As fontes da interface
        são carregadas do Google Fonts, o que expõe seu endereço IP ao Google nessa requisição.
      </p>

      <h2>9. Crianças e adolescentes</h2>
      <p>O serviço é voltado a profissionais e empresas e não se destina a menores de 18 anos.</p>

      <h2>10. Mudanças nesta política</h2>
      <p>
        Podemos atualizar esta política. Mudanças relevantes serão comunicadas por e-mail ou no serviço, e a data no
        topo desta página mostra a versão em vigor.
      </p>
    </LegalPage>
  );
}
