# Design System — Atloom

> Fonte de verdade visual. Todo build (Claude Code) referencia este arquivo.
> Arquétipo: **Editorial de orientação** com **sistema de movimento estilo Mercury** (scroll-coreografado).
> Produto: orientação vocacional + recomendação de cursos (pagos e gratuitos).
> Público: jovens buscando seus primeiros cursos / um norte de carreira.
> Meta de negócio: parceria com universidades → marca **séria o bastante pra instituição confiar +
> atraente o bastante pro jovem não achar "portal do governo".**
> Mood: sério, atraente, moderno.
> Fontes: **Fraunces** (display, Google) + **Hanken Grotesk** (corpo, Google).

---

## 0. Princípio-mestre

Gaste a ousadia em **um só lugar**: o título editorial em Fraunces + **um** motivo visual de
"trilhas que convergem" animado no scroll. Todo o resto é silencioso e disciplinado.
Credibilidade mora no esqueleto (estrutura validada de grandes sites); unicidade mora na pele
(tipografia + cor + contenção) e na **sensação de movimento** (física consistente, dirigida por scroll).

---

## 1. Cor (OKLCH — hex só como referência)

Papel neutro claro + tinta profunda + âncora verde-garrafa + acento âmbar parcimonioso.
NÃO é a paleta antiga (dark + verde-ácido + gradiente). Light, editorial, adulto.

```
/* Base / superfícies */
--paper:        oklch(98.2% 0.004 160);   /* ~#F6F7F5  fundo, papel neutro (NÃO creme) */
--surface:      oklch(100%  0     0  );   /* ~#FFFFFF  cards / painéis */
--surface-sunk: oklch(96.5% 0.006 160);   /* ~#EEF0ED  faixas alternadas, inputs */

/* Tinta / texto */
--ink:          oklch(23%   0.015 162);   /* ~#1B221F  texto principal (tinta, não preto puro) */
--ink-soft:     oklch(44%   0.012 162);   /* ~#5A635E  texto secundário */
--ink-muted:    oklch(60%   0.010 162);   /* ~#868E89  legendas, meta */

/* Marca / âncora (verde-garrafa) */
--brand:        oklch(41%   0.062 160);   /* ~#244B3F  CTA primário, logo, âncora */
--brand-hover:  oklch(36%   0.058 160);   /* ~#1C3E33 */
--brand-tint:   oklch(94%   0.020 160);   /* ~#E2EDE7  fundos sutis de destaque */

/* Acento (âmbar — o "pop" jovem, com parcimônia) */
--accent:       oklch(74%   0.135 72 );   /* ~#D4961F  destaque pontual, estados ativos */
--accent-soft:  oklch(92%   0.040 78 );   /* ~#F3E6C8  realces de fundo bem leves */

/* Linhas / estados */
--border:       oklch(90%   0.008 160);   /* ~#E0E4E1 */
--border-strong:oklch(82%   0.012 160);   /* ~#C6CDC8 */
--destructive:  oklch(52%   0.16  28 );   /* ~#AF3C2E  erro (tijolo, não vermelho puro) */
```

**Regras:** verde-garrafa = confiança; âmbar = atração (≤1 por viewport). Sem gradiente decorativo entre acentos. Sem preto puro/near-black de fundo.

---

## 2. Tipografia

```
--font-display: "Fraunces", Georgia, serif;     /* variável; pesos 400–500; optical sizing on */
--font-body:    "Hanken Grotesk", system-ui, sans-serif;
```

| Papel | Tamanho | Peso | line-height | tracking |
|---|---|---|---|---|
| Display (hero h1) | clamp(2.75rem, 6vw, 4.5rem) | 450 | 1.04 | -0.02em |
| H2 seção | clamp(1.9rem, 3.5vw, 2.6rem) | 450 | 1.1 | -0.015em |
| H3 | 1.35rem | 500 | 1.2 | -0.01em |
| Corpo | 1.0625rem (17px) | 400 | 1.6 | 0 |
| Subtítulo | 1.25rem | 400 | 1.5 | 0 |
| Meta / small | 0.875rem | 500 | 1.4 | 0 |

**Regras:** linha de corpo < 68ch. Fraunces como elemento de design (título grande e confiante dispensa decoração). **Proibido:** colorir uma palavra isolada do headline; eyebrow CAIXA ALTA espaçada; monospace decorativo.

---

## 3. Espaçamento, raio, elevação

Base 4: `4 8 12 16 24 32 48 64 96 128`. Seções respiram (96–128px vertical em desktop).

```
--r-sm: 8px;    --r-md: 14px;   --r-lg: 22px;   --r-full: 999px;
--shadow-raise: 0 1px 2px oklch(23% 0.015 162 / .06), 0 8px 24px oklch(23% 0.015 162 / .08);
```
Elevação só no que flutua (popover, card de CTA do quiz). Cards de conteúdo = borda + superfície, não dropshadow. **Proibido:** mesma sombra cinza em todo card; raio único em tudo.

---

## 4. Motion — "Sistema Mercury" (prioridade do projeto)

**Filosofia:** o movimento tem **função** — demonstrar o produto e revelar o que muda — nunca decoração.
Uma **linguagem física única** em todo o site (mola, interrompível — território `apple-design`).
O **scroll é a linha do tempo principal**: usar `useScroll` + `useTransform` do framer-motion pra
ligar revelações ao progresso de rolagem, não um simples "entrou na tela → fade".

**Tokens de mola / easing**
```
spring.gentle = { type: "spring", stiffness: 120, damping: 20, mass: 0.6 }
spring.snappy = { type: "spring", stiffness: 300, damping: 30 }
--dur: 220ms;  --dur-slow: 320ms;  --dur-cine: 500ms;
--ease: cubic-bezier(0.22, 1, 0.36, 1);
```

**Padrões a usar (o DNA do Mercury, traduzido):**
1. **Cenas scrolly "presas" (sticky/scrollytelling):** a seção fixa enquanto uma cena interna se monta
   conforme o scroll. Nosso equivalente ao "watch bills pay themselves" deles →
   **"veja o teste montar sua trilha"**: perguntas sendo respondidas, cursos sendo pareados,
   a trilha se formando — tudo dirigido pelo progresso de rolagem.
2. **Revelação de painéis de UI na entrada:** sobe + escala de ~0.96 com `spring.gentle`, UMA vez,
   com stagger curto *dentro* do painel. Não em cada elemento minúsculo.
3. **Parallax de profundidade:** camadas de fundo/frente em velocidades de scroll diferentes.
   Contido: no máximo 1–2 pontos no site inteiro.
4. **Micro-interações com mola:** hover/press de CTA e cards com escala por mola (interrompível).
   Contadores que sobem na faixa de prova.
5. **Momento-assinatura (o equivalente à "estrada"/anéis do Mercury):** UM só, em escala de hero.
   Como **motivo de "trilhas que convergem"** — linhas que se ramificam e se juntam num ponto —
   animado no scroll (Canvas/SVG). É a metáfora vocacional virando o momento cinematográfico.

**Escopo honesto (ler antes de prometer "igual ao Mercury"):**
- **Reproduzível em código (framer-motion) agora:** tudo em 1–5 acima. Entrega ~80% da *sensação* Mercury.
- **NÃO reproduzível só com código:** os clipes 3D renderizados do Mercury (feitos em Blender/C4D/AE).
  v1 usa o substituto codado (item 5). 3D renderizado real = frente de asset separada, depois.

**Regras:** `prefers-reduced-motion` troca toda coreografia por opacidade/instantâneo.
**Proibido:** fade-and-slide-up genérico em toda seção; hover em todo card "por hábito";
misturar curvas de easing diferentes. Se uma animação não demonstra nem esclarece nada, corta.

---

## 5. Layout & hero (o elemento memorável)

**Hero — fuja do "número grande + 4 stats".** Abra com o mais característico do produto: a **escolha de um caminho**.
- Headline editorial (Fraunces, frase inteira, sem palavra colorida).
- Subtítulo curto (a promessa: 5 perguntas → recomendações com justificativa).
- CTA primário: **"Fazer o teste"** (verde-garrafa). Secundário discreto: **"Sou uma instituição"**.
- Ao lado/atrás, sutil: o **motivo de trilhas convergentes** (seção 4, item 5) reagindo levemente ao scroll/mouse.
- As 4 métricas saem do hero → viram **faixa de prova discreta** mais abaixo e, quando houver,
  **logos de universidades parceiras** (fecha a meta de negócio).

**Logo após o hero: a primeira cena scrolly** = o teste se demonstrando (seção 4, item 1).

**Esqueleto da home (validado, mantém):**
nav → hero → **cena: o teste se monta** → como funciona (3 etapas, sequência real) → áreas →
prova social / parceiros → CTA final → footer.

**Alinhamento:** leitura à esquerda (editorial). Centralização só em blocos curtos de CTA.

---

## 6. Voz (copy é design)

Sentence case. Verbos ativos. Botão diz o que acontece ("Fazer o teste", não "Começar agora").
A ação mantém o nome no fluxo. Erro é direto e diz como resolver, sem desculpa. Tela vazia é convite à ação.
Tom: mentor que dá um norte — nem engessado, nem "coach".

---

## 7. PROIBIDO (checklist anti-IA — revisar todo build contra isto)

- [ ] Inter ou DM Sans como fonte protagonista.
- [ ] Fundo near-black tingido + acento ácido + gradiente entre acentos (a pele antiga).
- [ ] Fundo creme (#F4F1EA) + serif + terracota (#D97757).
- [ ] Eyebrow CAIXA ALTA espaçada acima de todo título.
- [ ] Palavra colorida isolada no headline.
- [ ] Hero "número grande + label" como tratamento principal.
- [ ] Cards idênticos: mesmo raio + mesma sombra cinza.
- [ ] "→"/seta grudada em texto de botão/link.
- [ ] Meta com middle-dot (A · B · C); rótulo "PALAVRA — fragmento".
- [ ] Monospace em rótulo pequeno por estética.
- [ ] Fade-slide genérico em toda seção; hover por hábito em todo card.
- [ ] Mistura de curvas de easing; animação sem função.
- [ ] Numeração 01/02/03 onde não há sequência real.

> Regra de ouro: antes de finalizar, tire um acessório (Chanel). Se não serve ao brief, corta.

---

## 8. Referências (pasta `refs/` — calibração de composição, NÃO clonar)

- `refs03-mercury-hero` → **principal**: sistema de movimento (scroll-coreografia, revelações de UI, molas).
- `refs01-80000hours-*` → gêmeo de brief: autoridade calma de um produto de orientação.
- `refs02-stripe-hero` → ritmo de espaçamento, hierarquia, contenção, 1 acento.
- `refs04-brilliant-hero` → crível e atraente ao mesmo tempo (tensão jovem × sério).
- `refs05-maven-categorias` → categorias/cursos sem a cara de "kit de cards SaaS".
