import { SiteFooter } from "@/components/SiteFooter";
import { AreaList } from "@/components/home/AreaList";
import { getAreaSummaries, getProofFacts } from "@/components/home/catalogFacts";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HomeNav } from "@/components/home/HomeNav";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MotionProvider } from "@/components/home/MotionProvider";
import { ProofBand } from "@/components/home/ProofBand";
import { TestAssemblyScene } from "@/components/home/TestAssemblyScene";

export default function Home() {
  // Calculado no servidor a partir do catálogo: o cliente recebe só os resumos.
  const areas = getAreaSummaries();
  const proof = getProofFacts();

  return (
    <div className="atl atl-home" id="top">
      <a href="#conteudo" className="atl-skip">
        Pular para o conteúdo
      </a>
      <MotionProvider>
        <HomeNav />
        <main id="conteudo">
          <Hero />
          <TestAssemblyScene />
          <HowItWorks />
          <AreaList areas={areas} />
          <ProofBand facts={proof} />
          <FinalCta />
        </main>
      </MotionProvider>
      <SiteFooter />
    </div>
  );
}
