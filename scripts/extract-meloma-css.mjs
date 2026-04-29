import fs from "fs";

const htmlPath =
  "C:/Users/Alejandro/OneDrive/Documentos/referencia visual/Melomacarona — Encontre o curso perfeito para você.html";
const outPath =
  "C:/Users/Alejandro/OneDrive/Documentos/CURSOS/cursos-app/app/melomacarona-landing.css";

let raw = fs.readFileSync(htmlPath, "utf8");
const start = raw.indexOf("<style>");
const end = raw.indexOf("</style>");
if (start === -1 || end === -1) throw new Error("no style block");
let css = raw.slice(start + 7, end);
css = css.replace(/\/\*[\s\S]*?\*\//g, "");

css = css.replace(/^\s*:root\s*\{/m, ".meloma-landing {");

const strip = [
  /\*,\s*\*::before[^}]*\}/s,
  /html\s*\{[^}]*\}/,
  /body\s*\{[^}]*\}/,
  /img\s*\{[^}]*\}/,
  /a\s*\{[^}]*\}/,
  /button\s*\{[^}]*\}/,
  /ul,\s*ol\s*\{[^}]*\}/,
  /input,\s*textarea,\s*select\s*\{[^}]*\}/,
];
for (const re of strip) css = css.replace(re, "");

function findClosingBrace(s, from) {
  let depth = 0;
  for (let i = from; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function prefixRuleSelectors(selectorText) {
  return selectorText
    .split(",")
    .map((p) => {
      const s = p.trim();
      if (!s) return s;
      if (s.startsWith(".meloma-landing")) return s;
      return `.meloma-landing ${s}`;
    })
    .join(", ");
}

function transformBlock(cssChunk) {
  let pos = 0;
  let out = "";
  while (pos < cssChunk.length) {
    const open = cssChunk.indexOf("{", pos);
    if (open === -1) {
      out += cssChunk.slice(pos);
      break;
    }
    const before = cssChunk.slice(pos, open);
    const rulesel = before.trim();
    if (!rulesel) {
      pos = open + 1;
      continue;
    }
    const close = findClosingBrace(cssChunk, open);
    if (close === -1) break;
    const body = cssChunk.slice(open + 1, close);
    if (rulesel.startsWith("@keyframes") || rulesel.startsWith("@import")) {
      out += rulesel + "{" + body + "}";
    } else if (rulesel.startsWith("@media")) {
      out += rulesel + "{" + transformBlock(body) + "}";
    } else {
      out += prefixRuleSelectors(rulesel) + "{" + body + "}";
    }
    pos = close + 1;
  }
  return out;
}

const transformed = transformBlock(css);
const header = `/* Auto-extracted from reference HTML, scoped to .meloma-landing */
`;
fs.writeFileSync(outPath, header + transformed, "utf8");
console.log("Wrote", outPath, "length", transformed.length);
