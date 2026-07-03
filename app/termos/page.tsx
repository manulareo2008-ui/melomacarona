import type { Metadata } from "next";
import Link from "next/link";
import { TrustArticleShell } from "@/components/TrustArticleShell";
import InternalHeader from "@/components/InternalHeader";

export const metadata: Metadata = {
  title: "Termos de uso",
  description:
    "Condições gerais de uso do site Atloom e do assistente de recomendação.",
};

export default function TermosPage() {
  return (
    <>
      <InternalHeader />
      <TrustArticleShell title="Termos de Uso">
        <p className="text-sm text-slate-400">
          <strong className="font-semibold text-slate-300">Última atualização:</strong> 3 de julho de 2026
        </p>

        <p>
          Bem-vindo ao Atloom. Estes Termos de Uso regulam o acesso e a utilização da
          plataforma. Ao usar o Atloom, você concorda integralmente com estes termos. Caso
          não concorde, por favor não utilize a plataforma.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. O que é o Atloom</h2>
          <p>
            O Atloom é uma plataforma gratuita de <strong>recomendação de cursos</strong>.
            Através de um questionário interativo, o Atloom sugere cursos e trilhas de
            aprendizado alinhados aos interesses, objetivos e perfil de cada usuário.
          </p>
          <p>
            O Atloom <strong>não é uma instituição de ensino</strong> e{" "}
            <strong>não oferece os cursos diretamente</strong>. Atuamos como uma ponte que
            conecta usuários a conteúdos e instituições educacionais de terceiros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Gratuidade para o usuário</h2>
          <p>
            O uso do Atloom é <strong>gratuito para os alunos e usuários finais</strong>. Não
            cobramos pela recomendação de cursos nem pelo acesso à plataforma.
          </p>
          <p>
            A sustentação do Atloom se dá por meio de parcerias e patrocínios com instituições
            educacionais, o que não gera qualquer custo ao usuário final.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. Cadastro e informações fornecidas</h2>
          <p>
            Para utilizar determinadas funcionalidades, você poderá fornecer informações como
            nome, e-mail e respostas ao questionário de recomendação. Você se compromete a
            fornecer informações <strong>verdadeiras e atualizadas</strong>.
          </p>
          <p>
            O tratamento desses dados é regido pela nossa{" "}
            <Link href="/privacidade" className="font-medium text-emerald-300 hover:underline">
              Política de Privacidade
            </Link>
            , em conformidade com a LGPD.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. Uso adequado da plataforma</h2>
          <p>
            Ao utilizar o Atloom, você concorda em <strong>não</strong>:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>Utilizar a plataforma para fins ilegais, fraudulentos ou não autorizados;</li>
            <li>Tentar acessar áreas restritas, sistemas ou dados sem autorização;</li>
            <li>
              Interferir no funcionamento da plataforma, sobrecarregá-la ou introduzir código
              malicioso;
            </li>
            <li>
              Copiar, reproduzir ou explorar comercialmente o conteúdo do Atloom sem
              autorização;
            </li>
            <li>Coletar dados de outros usuários de forma automatizada (scraping) ou indevida.</li>
          </ul>
          <p>O descumprimento pode resultar na suspensão ou no bloqueio do acesso.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. Recomendações e conteúdo de terceiros</h2>
          <p>
            As recomendações do Atloom são geradas com base nas informações que você fornece e
            têm caráter <strong>informativo e de sugestão</strong>. Não garantimos que um curso
            recomendado atenderá perfeitamente às suas expectativas.
          </p>
          <p>
            Os cursos, preços, disponibilidade e conteúdos são de responsabilidade das{" "}
            <strong>instituições de ensino terceiras</strong>. O Atloom não se responsabiliza
            pela qualidade, pela veracidade das informações fornecidas por terceiros, nem pela
            relação entre você e a instituição escolhida.
          </p>
          <p>
            Recomendamos que você verifique as informações diretamente com a instituição antes
            de qualquer decisão ou pagamento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Propriedade intelectual</h2>
          <p>
            A marca &ldquo;Atloom&rdquo;, o logotipo, a identidade visual, o design da
            plataforma, os textos e o código-fonte são de propriedade do Atloom e protegidos
            por lei. É proibida a reprodução, distribuição ou uso sem autorização prévia e por
            escrito.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Disponibilidade e alterações</h2>
          <p>
            Empenhamo-nos para manter o Atloom disponível e funcional, mas{" "}
            <strong>não garantimos disponibilidade ininterrupta</strong>. A plataforma pode
            passar por manutenções, atualizações ou interrupções técnicas.
          </p>
          <p>
            Podemos, a qualquer momento, modificar, suspender ou descontinuar funcionalidades —
            no todo ou em parte — buscando sempre comunicar mudanças relevantes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Limitação de responsabilidade</h2>
          <p>
            O Atloom é oferecido &ldquo;no estado em que se encontra&rdquo;. Na máxima extensão
            permitida por lei, o Atloom não se responsabiliza por:
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>Decisões tomadas com base nas recomendações fornecidas;</li>
            <li>Danos decorrentes da relação entre você e instituições de ensino terceiras;</li>
            <li>Indisponibilidades técnicas, perdas de dados ou falhas de terceiros.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">9. Alterações nestes Termos</h2>
          <p>
            Estes Termos de Uso podem ser atualizados periodicamente. A data da última
            atualização estará sempre indicada no topo. O uso continuado da plataforma após
            alterações implica concordância com os novos termos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">10. Legislação aplicável e foro</h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito
            o foro do domicílio do usuário para dirimir eventuais controvérsias, conforme
            aplicável à legislação consumerista.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">11. Contato</h2>
          <p>Dúvidas sobre estes Termos de Uso:</p>
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
