import type { Metadata } from "next";
import Link from "next/link";
import { TrustArticleShell } from "@/components/TrustArticleShell";

export const metadata: Metadata = {
  title: "Parcerias",
  description:
    "Instituições e educadores: colabore com o Melomacarona para alcançar estudantes com perfil alinhado.",
};

export default function ParceriasPage() {
  return (
    <TrustArticleShell title="Parcerias institucionais e educadores">
      <p className="text-base text-slate-200">
        O Melomacarona conecta pessoas em busca de formação a trilhas e cursos alinhados ao
        perfil. Para parceiros, isso significa tráfego qualificado e narrativa clara da sua
        oferta no momento da decisão.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">O que oferecemos (roadmap)</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Presença em fluxos de recomendação com critérios transparentes.</li>
          <li>Materiais de divulgação e mensuração agregada de interesse (sem violar LGPD).</li>
          <li>Possibilidade de modelos por campanha, licença ou indicadores acordados.</li>
        </ul>
        <p className="text-slate-400">
          Integrações comerciais e contratos formais entram após alinhamento jurídico e
          técnico — veja abaixo o que precisamos do parceiro para avançar.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-indigo-500/25 bg-indigo-950/30 p-5">
        <h2 className="text-lg font-semibold text-white">Próximo passo</h2>
        <p>
          Envie uma mensagem pela página{" "}
          <Link href="/contato" className="font-medium text-indigo-300 hover:underline">
            Contato
          </Link>{" "}
          com: nome da instituição ou marca, site, público-alvo e tipo de parceria desejada
          (destaque no catálogo, campanha regional, afiliados, etc.).
        </p>
      </section>
    </TrustArticleShell>
  );
}
