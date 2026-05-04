import type { Metadata } from "next";
import Link from "next/link";
import { TrustArticleShell } from "@/components/TrustArticleShell";
import { getPublicContactEmail } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Termos de uso",
  description:
    "Condições gerais de uso do site Melomacarona e do assistente de recomendação.",
};

export default function TermosPage() {
  const email = getPublicContactEmail();

  return (
    <TrustArticleShell title="Termos de uso">
      <p className="rounded-lg border border-amber-500/30 bg-amber-950/40 px-4 py-3 text-amber-100/95">
        <strong className="font-semibold">Texto-modelo.</strong> Ajuste com assessoria
        jurídica antes de publicar comercialmente (razão social, foro, disputas,
        assinaturas).
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">1. Aceitação</h2>
        <p>
          Ao acessar ou usar este site, você declara ter lido e concordado com estes termos.
          Se não concordar, interrompa o uso.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">2. Natureza do serviço</h2>
        <p>
          O site oferece orientação informativa e recomendações de cursos com base nas
          informações que você fornece e em fontes públicas ou integrações disponíveis. Não
          substitui orientação educacional individual, regulamentação profissional nem
          decisões de matrícula — que permanecem de sua exclusiva responsabilidade.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">3. Uso permitido</h2>
        <p>
          Compromete-se a utilizar o serviço de boa-fé, sem violar leis, direitos de
          terceiros, nem tentar comprometer a segurança ou o funcionamento da plataforma.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">4. Links e terceiros</h2>
        <p>
          Recomendações podem incluir links para plataformas externas (faculdades,
          marketplaces de cursos). Preços, disponibilidade e termos desses sites são de
          exclusiva responsabilidade dos respectivos fornecedores.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">5. Limitação de responsabilidade</h2>
        <p>
          Na máxima extensão permitida pela lei aplicável, o serviço é oferecido “no estado
          em que se encontra”. Não garantimos resultados específicos de carreira ou
          empregabilidade. Em nenhum caso seremos responsáveis por danos indiretos ou lucros
          cessantes decorrentes do uso das informações.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">6. Contas e planos pagos</h2>
        <p>
          Quando houver planos pagos ou parcerias comerciais, condições adicionais (preço,
          renovação, cancelamento, nota fiscal) serão apresentadas no momento da contratação
          e poderão integrar estes termos por referência.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">7. Privacidade</h2>
        <p>
          O tratamento de dados pessoais é descrito na{" "}
          <Link href="/privacidade" className="font-medium text-emerald-300 hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">8. Alterações</h2>
        <p>
          Podemos alterar estes termos; recomenda-se revisar periodicamente. Alterações
          relevantes podem ser comunicadas por meio adequado (por exemplo, aviso no site ou
          e-mail, conforme aplicável).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">9. Contato</h2>
        <p>
          Dúvidas sobre estes termos:{" "}
          {email ? (
            <a href={`mailto:${encodeURIComponent(email)}`} className="font-medium text-emerald-300 hover:underline">
              {email}
            </a>
          ) : (
            <span>
              configure <code className="text-emerald-300">NEXT_PUBLIC_CONTACT_EMAIL</code>.
            </span>
          )}
        </p>
      </section>
    </TrustArticleShell>
  );
}
