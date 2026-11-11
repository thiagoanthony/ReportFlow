import type { Metadata } from "next";
import { LegalPage } from "@/app/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Termos de uso | ReportFlow" };

export default function TermosPage() {
  return (
    <LegalPage title="Termos de uso">
      <p>
        Estes termos regem o uso do {LEGAL.productName}, plataforma que ajuda agências de marketing a reunir dados
        de campanhas de anúncios e gerar relatórios com análise de inteligência artificial. Ao criar uma conta ou
        usar o serviço, você declara que leu e concorda com eles.
      </p>

      <h2>1. Quem somos</h2>
      <p>
        O serviço é oferecido por {LEGAL.operatorName} ({LEGAL.operatorDocument}), que chamamos aqui de “nós”.
        Contato: {LEGAL.contactEmail}.
      </p>

      <h2>2. O serviço</h2>
      <p>
        O {LEGAL.productName} permite cadastrar clientes da sua agência, conectar contas de anúncios (hoje, Google
        Ads; Meta Ads está em desenvolvimento), gerar relatórios de desempenho com análise escrita por IA e baixá-los
        em PDF. Recursos listados como “em breve” ainda não estão disponíveis e podem mudar antes do lançamento.
      </p>

      <h2>3. Conta e acesso</h2>
      <ul>
        <li>O acesso é feito com uma conta Google. Você é responsável por manter essa conta segura.</li>
        <li>Você deve ter capacidade legal para contratar e usar o serviço em nome da sua agência.</li>
        <li>As informações que você fornece devem ser verdadeiras e estar atualizadas.</li>
      </ul>

      <h2>4. Teste grátis, planos e pagamento</h2>
      <ul>
        <li>
          Toda conta nova tem 14 dias de teste grátis, sem cartão de crédito, com limite de clientes definido no
          momento do cadastro.
        </li>
        <li>
          Depois do teste, é preciso contratar um plano pago para continuar criando clientes e relatórios. Os
          relatórios já gerados continuam disponíveis para consulta e download.
        </li>
        <li>
          Os planos são mensais, renovados automaticamente. Os preços e limites vigentes ficam na página de planos.
          O pagamento é processado pelo Stripe; nós não armazenamos os dados do seu cartão.
        </li>
        <li>
          Você pode cancelar a qualquer momento em Configurações, sem multa ou fidelidade. O cancelamento vale para
          as próximas cobranças. Em caso de falha de pagamento, podemos suspender a criação de novos clientes e
          relatórios até a regularização.
        </li>
        <li>
          Pedidos de reembolso são analisados caso a caso e conforme a legislação aplicável. Escreva para{" "}
          {LEGAL.contactEmail}.
        </li>
        <li>Podemos reajustar preços, avisando você com antecedência razoável antes da próxima renovação.</li>
      </ul>

      <h2>5. Contas de anúncios de terceiros</h2>
      <p>
        Ao conectar uma conta de anúncios de um cliente seu, você declara que tem autorização do titular para acessar
        esses dados e gerar relatórios sobre eles. Você é o responsável por essa autorização e pelo uso dos relatórios
        com seus clientes. Podemos ter o acesso às integrações interrompido por mudanças, limites ou decisões das
        próprias plataformas (como Google e Meta), sem que isso seja falha nossa.
      </p>

      <h2>6. Conteúdo gerado por inteligência artificial</h2>
      <p>
        As análises dos relatórios são geradas por IA a partir das métricas coletadas e podem conter imprecisões ou
        recomendações inadequadas ao seu caso. Revise o conteúdo antes de enviá-lo a um cliente. Os números do
        relatório vêm das plataformas de anúncios; não garantimos que coincidam com outras ferramentas, nem resultados
        de negócio decorrentes das recomendações.
      </p>

      <h2>7. Uso aceitável</h2>
      <p>Você concorda em não:</p>
      <ul>
        <li>usar o serviço para fins ilegais ou para acessar contas sem autorização;</li>
        <li>tentar burlar limites de plano, medidas de segurança ou o acesso de outros usuários;</li>
        <li>copiar, revender ou fazer engenharia reversa do serviço, salvo quando a lei permitir;</li>
        <li>sobrecarregar a plataforma com uso automatizado abusivo.</li>
      </ul>

      <h2>8. Seus dados</h2>
      <p>
        Os dados que você e seus clientes inserem ou conectam continuam sendo seus. Nós os tratamos para prestar o
        serviço, conforme descrito na <a href="/privacidade">Política de privacidade</a>. Você pode excluir sua conta
        em Configurações, o que remove seus dados da plataforma, ressalvadas obrigações legais de guarda.
      </p>

      <h2>9. Propriedade intelectual</h2>
      <p>
        O software, a marca e o design do {LEGAL.productName} pertencem a nós. Você recebe uma licença limitada,
        revogável e não exclusiva para usar o serviço enquanto sua conta estiver ativa. Os relatórios gerados para
        seus clientes podem ser usados livremente por você.
      </p>

      <h2>10. Disponibilidade e limitação de responsabilidade</h2>
      <p>
        Trabalhamos para manter o serviço disponível, mas ele é fornecido “como está”, sem garantia de
        funcionamento ininterrupto ou livre de erros. Na extensão permitida em lei, nossa responsabilidade se limita
        ao valor pago por você nos 12 meses anteriores ao evento que gerou a reclamação, e não inclui lucros cessantes
        nem danos indiretos. Nada nestes termos limita direitos que a lei não permita limitar.
      </p>

      <h2>11. Encerramento</h2>
      <p>
        Você pode parar de usar o serviço e excluir sua conta quando quiser. Podemos suspender ou encerrar contas que
        violem estes termos, com aviso quando possível.
      </p>

      <h2>12. Mudanças nos termos</h2>
      <p>
        Podemos atualizar estes termos. Mudanças relevantes serão comunicadas por e-mail ou no próprio serviço, e o
        uso após a mudança significa que você concorda com a nova versão.
      </p>

      <h2>13. Lei aplicável e foro</h2>
      <p>
        Estes termos seguem as leis brasileiras. Fica eleito o foro da comarca de {LEGAL.forum}, sem prejuízo de
        foro diverso previsto em lei para o consumidor.
      </p>

      <h2>14. Contato</h2>
      <p>Dúvidas sobre estes termos: {LEGAL.contactEmail}.</p>
    </LegalPage>
  );
}
