import type { Metadata } from "next";
import { TrustArticleShell } from "@/components/TrustArticleShell";
import InternalHeader from "@/components/InternalHeader";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como tratamos dados pessoais no assistente de recomendação de cursos Atloom.",
};

export default function PrivacidadePage() {
  return (
    <>
      <InternalHeader />
      <TrustArticleShell title="Política de Privacidade">
        <p className="text-sm text-slate-400">
          <strong className="font-semibold text-slate-300">Última atualização:</strong> 3 de julho de 2026
        </p>

        <p>
          Esta Política de Privacidade descreve como o Atloom coleta, usa, armazena e protege
          os dados pessoais dos usuários da plataforma, em conformidade com a Lei nº
          13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD).
        </p>
        <p>Ao utilizar o Atloom, você concorda com as práticas descritas neste documento.</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            1. Quem é o responsável pelos seus dados (Controlador)
          </h2>
          <p>
            O controlador dos dados pessoais tratados pelo Atloom é <strong>Manuel Lareo</strong>,
            responsável pela operação da plataforma.
          </p>
          <p>
            Para qualquer questão relacionada aos seus dados pessoais, entre em contato pelo
            e-mail:{" "}
            <a
              href="mailto:privacidade@atloom.com.br"
              className="font-medium text-emerald-300 hover:underline"
            >
              privacidade@atloom.com.br
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Quais dados coletamos</h2>
          <p>
            O Atloom foi construído sob o princípio da <strong>minimização de dados</strong>:
            coletamos apenas o necessário para oferecer a recomendação de cursos.
          </p>

          <p>
            <strong className="text-white">2.1. Dados que você nos fornece diretamente</strong>
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>Nome</li>
            <li>Endereço de e-mail</li>
            <li>
              Respostas fornecidas ao questionário de recomendação (o &ldquo;wizard&rdquo;),
              incluindo suas preferências, interesses e objetivos de aprendizado.
            </li>
          </ul>

          <p>
            <strong className="text-white">2.2. Dados coletados automaticamente</strong>
          </p>
          <p>
            Quando você acessa a plataforma, nossos servidores e provedores de infraestrutura
            (como a Vercel, responsável pela hospedagem) podem registrar automaticamente dados
            técnicos, tais como:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>Endereço IP</li>
            <li>Tipo de navegador e dispositivo</li>
            <li>Data e hora de acesso</li>
            <li>Páginas visitadas</li>
          </ul>
          <p>
            Esses dados são coletados para fins de segurança, funcionamento e melhoria da
            plataforma.
          </p>

          <p>
            <strong className="text-white">2.3. Cookies e tecnologias similares</strong>
          </p>
          <p>
            O Atloom pode utilizar cookies essenciais para o funcionamento da plataforma. Caso
            venhamos a utilizar ferramentas de análise de tráfego (como analytics), isso será
            informado e, quando exigido por lei, solicitaremos seu consentimento.{" "}
            <em>
              (Esta seção será atualizada conforme a configuração final de cookies e analytics
              da plataforma.)
            </em>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            3. Para que usamos os seus dados (Finalidade)
          </h2>
          <p>Utilizamos seus dados pessoais exclusivamente para:</p>
          <ul className="list-inside list-disc space-y-2">
            <li>Gerar recomendações personalizadas de cursos com base nas suas respostas;</li>
            <li>Entrar em contato, quando necessário, sobre a sua experiência na plataforma;</li>
            <li>Garantir a segurança, o funcionamento e a melhoria contínua do Atloom;</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
          <p>
            <strong>
              Não vendemos, alugamos ou comercializamos seus dados pessoais com terceiros.
            </strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. Base legal para o tratamento</h2>
          <p>
            O tratamento dos seus dados fundamenta-se nas seguintes bases legais previstas na
            LGPD:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Consentimento</strong> (art. 7º, I): para o processamento das respostas
              do questionário e envio de comunicações;
            </li>
            <li>
              <strong>Legítimo interesse</strong> (art. 7º, IX): para segurança, funcionamento
              e melhoria da plataforma;
            </li>
            <li>
              <strong>Cumprimento de obrigação legal</strong> (art. 7º, II): quando aplicável.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. Com quem compartilhamos seus dados</h2>
          <p>
            O Atloom pode compartilhar dados com <strong>operadores</strong> que nos prestam
            serviços essenciais de infraestrutura, sempre sob obrigações de confidencialidade e
            segurança. Atualmente:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Provedor de hospedagem</strong> (Vercel) — para funcionamento da
              plataforma;
            </li>
            <li>
              <strong>Provedor de banco de dados</strong> (Supabase) — para armazenamento
              seguro das informações.
            </li>
          </ul>
          <p>
            Esses provedores atuam apenas conforme nossas instruções e não utilizam seus dados
            para finalidades próprias.
          </p>
          <p>
            Poderemos ainda compartilhar dados quando exigido por autoridade competente ou
            obrigação legal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Por quanto tempo guardamos seus dados</h2>
          <p>
            Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as
            finalidades descritas nesta política, ou conforme exigido por obrigações legais.
            Você pode solicitar a exclusão dos seus dados a qualquer momento (ver seção 7).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Seus direitos como titular</h2>
          <p>
            Nos termos da LGPD (art. 18), você tem o direito de, a qualquer momento e mediante
            requisição:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>Confirmar a existência de tratamento dos seus dados;</li>
            <li>Acessar os seus dados;</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Solicitar a portabilidade dos dados;</li>
            <li>
              Revogar o consentimento e solicitar a eliminação dos dados tratados com base nele;
            </li>
            <li>Obter informação sobre com quem compartilhamos seus dados.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, envie um e-mail para{" "}
            <a
              href="mailto:privacidade@atloom.com.br"
              className="font-medium text-emerald-300 hover:underline"
            >
              privacidade@atloom.com.br
            </a>
            . Responderemos no menor prazo possível, conforme previsto em lei.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Segurança dos dados</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos
            não autorizados, perda, alteração ou destruição, incluindo controle de acesso, uso
            de provedores seguros e boas práticas de gestão de credenciais.
          </p>
          <p>
            Nenhum sistema é 100% infalível, mas trabalhamos continuamente para manter o mais
            alto padrão de segurança possível.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">9. Dados de menores de idade</h2>
          <p>
            Caso o Atloom venha a tratar dados de menores de idade, isso será feito no melhor
            interesse do menor e, quando exigido por lei, mediante consentimento específico de
            pelo menos um dos pais ou responsável legal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">10. Alterações nesta política</h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente. A data da última
            atualização estará sempre indicada no topo do documento. Recomendamos a revisão
            regular desta página.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">11. Contato</h2>
          <p>
            Dúvidas, solicitações ou reclamações sobre esta política ou sobre o tratamento dos
            seus dados:
          </p>
          <p>
            <strong className="font-semibold text-white">E-mail:</strong>{" "}
            <a
              href="mailto:privacidade@atloom.com.br"
              className="font-medium text-emerald-300 hover:underline"
            >
              privacidade@atloom.com.br
            </a>
            <br />
            <strong className="font-semibold text-white">Responsável:</strong> Manuel Lareo
          </p>
        </section>
      </TrustArticleShell>
    </>
  );
}
