import type { Metadata } from "next";
import { TrustArticleShell } from "@/components/TrustArticleShell";
import { getPublicContactEmail, getSiteOperatorLabel } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como tratamos dados pessoais no assistente de recomendação de cursos Melomacarona.",
};

export default function PrivacidadePage() {
  const operator = getSiteOperatorLabel();
  const email = getPublicContactEmail();

  return (
    <TrustArticleShell title="Política de Privacidade">
      <p className="rounded-lg border border-amber-500/30 bg-amber-950/40 px-4 py-3 text-amber-100/95">
        <strong className="font-semibold">Texto-modelo.</strong> Esta página descreve boas
        práticas em linguagem acessível; deve ser revisada por advogado e adaptada ao seu
        caso (razão social, CNPJ, DPO, bases legais específicas).
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">1. Responsável pelo tratamento</h2>
        <p>
          O tratamento de dados pessoais observa a Lei nº 13.709/2018 (LGPD). Em relação a
          este site, considera-se responsável: <strong>{operator}</strong>. Você pode definir
          razão social e CNPJ via variável de ambiente <code className="text-emerald-300">NEXT_PUBLIC_SITE_OPERATOR_NAME</code>{" "}
          e revisar este texto com seu jurídico.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">2. Que dados podemos coletar</h2>
        <ul className="list-inside list-disc space-y-2 text-slate-300">
          <li>Dados informados no fluxo do quiz (interesses, objetivos, preferências).</li>
          <li>
            Dados de conta e autenticação na área premium, quando você criar conta ou
            sessão.
          </li>
          <li>
            Dados técnicos automáticos (IP, tipo de navegador, página visitada, tempo
            aproximado de uso), quando necessários à segurança ou medições agregadas.
          </li>
          <li>Mensagens ou avaliações que você enviar voluntariamente.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">3. Finalidades</h2>
        <p>Usamos os dados para:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>Personalizar recomendações de cursos e conteúdos.</li>
          <li>Manter o funcionamento técnico do site e prevenir fraudes.</li>
          <li>Mensurar uso agregado para melhorar o produto.</li>
          <li>Cumprir obrigações legais e responder a solicitações legítimas.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">4. Bases legais (LGPD)</h2>
        <p>
          Dependendo do caso, o tratamento pode se apoiar em execução de contrato, legítimo
          interesse (com equilíbrio com seus direitos), consentimento quando exigido, ou
          outra base prevista em lei. Ajuste esta seção com assessoria jurídica.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">5. Compartilhamento</h2>
        <p>
          Não vendemos seus dados. Podemos compartilhar com prestadores de serviço
          (hospedagem, e-mail transacional, analytics) que atuam sob instruções e
          contratos compatíveis com a LGPD, ou quando a lei exigir.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">6. Seus direitos</h2>
        <p>
          Você pode solicitar confirmação de tratamento, acesso, correção, anonimização,
          portabilidade, eliminação de dados desnecessários, informação sobre
          compartilhamento e revogação de consentimento, nos limites da lei, entrando em
          contato pelo canal abaixo.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">7. Retenção e segurança</h2>
        <p>
          Mantemos dados pelo tempo necessário às finalidades descritas e às obrigações
          legais, aplicando medidas técnicas e organizacionais razoáveis de proteção — sem
          garantir segurança absoluta em ambientes de internet.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">8. Cookies e tecnologias similares</h2>
        <p>
          Utilizamos cookies ou armazenamento local quando necessário ao funcionamento ou,
          mediante consentimento quando aplicável, para análise. Você pode gerenciar cookies
          no próprio navegador.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">9. Alterações</h2>
        <p>
          Esta política pode ser atualizada; a data da revisão poderá ser indicada no topo
          da página. Uso continuado após alterações relevantes pode implicar aceitação, nos
          termos que seu jurídico definir.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">10. Contato</h2>
        <p>
          Para exercer direitos ou dúvidas sobre privacidade:{" "}
          {email ? (
            <a href={`mailto:${encodeURIComponent(email)}`} className="font-medium text-emerald-300 hover:underline">
              {email}
            </a>
          ) : (
            <span>
              Configure <code className="text-emerald-300">NEXT_PUBLIC_CONTACT_EMAIL</code> no
              ambiente de produção.
            </span>
          )}
        </p>
      </section>
    </TrustArticleShell>
  );
}
