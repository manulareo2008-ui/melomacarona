"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import InternalHeader from "@/components/InternalHeader";
const EMAILJS_SERVICE_ID = "service_lr78g87";
const EMAILJS_TEMPLATE_ID = "template_6tiiw2q";
const EMAILJS_PUBLIC_KEY = "aCa83XAnA-2Uv_Eff";

type FormData = {
  // Step 1 — Identificação
  nomeInstituicao: string;
  cnpj: string;
  site: string;
  tipoInstituicao: string;
  cidadeSede: string;
  estadoSede: string;
  // Step 2 — Perfil Educacional
  possuiCursosPropriosBool: string;
  modalidades: string[];
  areasAtuacao: string[];
  publicoAlvo: string[];
  numeroCursos: string;
  plataformasParceiras: string;
  diferencialPedagogico: string;
  // Step 3 — Interesse Comercial
  planoInteresse: string;
  objetivoPrimario: string;
  orcamentoMensal: string;
  prazoDecisao: string;
  comoConheceu: string;
  // Step 4 — Contato
  nomeResponsavel: string;
  cargoResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel: string;
  melhorHorario: string;
  mensagemAdicional: string;
};

const initialData: FormData = {
  nomeInstituicao: "",
  cnpj: "",
  site: "",
  tipoInstituicao: "",
  cidadeSede: "",
  estadoSede: "",
  possuiCursosPropriosBool: "",
  modalidades: [],
  areasAtuacao: [],
  publicoAlvo: [],
  numeroCursos: "",
  plataformasParceiras: "",
  diferencialPedagogico: "",
  planoInteresse: "",
  objetivoPrimario: "",
  orcamentoMensal: "",
  prazoDecisao: "",
  comoConheceu: "",
  nomeResponsavel: "",
  cargoResponsavel: "",
  emailResponsavel: "",
  telefoneResponsavel: "",
  melhorHorario: "",
  mensagemAdicional: "",
};

const AREAS = [
  "Tecnologia e TI",
  "Design e UX",
  "Marketing Digital",
  "Dados e Inteligência Artificial",
  "Negócios e Gestão",
  "Idiomas",
  "Finanças e Contabilidade",
  "Saúde e Bem-estar",
  "Educação e Pedagogia",
  "Engenharia",
  "Direito",
  "Comunicação e Jornalismo",
];

const MODALIDADES = [
  "100% Online (assíncrono)",
  "Online ao vivo (síncrono)",
  "Híbrido",
  "Presencial",
  "Bootcamp intensivo",
  "Pós-graduação / MBA",
  "Extensão universitária",
  "Livre (sem certificação formal)",
];

const PUBLICO = [
  "Iniciantes sem experiência",
  "Profissionais em transição de carreira",
  "Profissionais em nível intermediário",
  "Profissionais sênior / especialistas",
  "Estudantes universitários",
  "Empreendedores",
  "Empresas (B2B / in-company)",
];

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "10px",
    }}>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: active ? "1.5px solid #C8FF4D" : "1px solid rgba(255,255,255,0.12)",
              background: active ? "rgba(200,255,77,0.08)" : "rgba(255,255,255,0.03)",
              color: active ? "#C8FF4D" : "rgba(255,255,255,0.6)",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: active ? 500 : 400,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

type ValidatorType = "cnpj" | "email" | "phone" | "url";

function validateField(value: string, type: ValidatorType): string {
  if (!value.trim()) return "";

  if (type === "cnpj") {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 14) return "CNPJ deve ter 14 dígitos.";
    if (/^(\d)\1+$/.test(digits)) return "CNPJ inválido.";
    // Validação dos dígitos verificadores
    const calc = (slice: string, factors: number[]) => {
      const sum = slice.split("").reduce((acc, d, i) => acc + parseInt(d) * factors[i], 0);
      const mod = sum % 11;
      return mod < 2 ? 0 : 11 - mod;
    };
    const f1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const f2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const d1 = calc(digits.slice(0, 12), f1);
    const d2 = calc(digits.slice(0, 13), f2);
    if (parseInt(digits[12]) !== d1 || parseInt(digits[13]) !== d2) {
      return "CNPJ inválido. Verifique os números.";
    }
    return "";
  }

  if (type === "email") {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(value)) return "E-mail inválido. Use o formato nome@dominio.com.";
    return "";
  }

  if (type === "phone") {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) {
      return "Telefone deve ter DDD + número (10 ou 11 dígitos).";
    }
    return "";
  }

  if (type === "url") {
    try {
      const url = value.startsWith("http") ? value : `https://${value}`;
      new URL(url);
      if (!url.includes(".")) return "URL inválida. Inclua um domínio (ex: exemplo.com).";
      return "";
    } catch {
      return "URL inválida.";
    }
  }

  return "";
}

function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  validator,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  validator?: ValidatorType;
}) {
  const [touched, setTouched] = useState(false);
  const error = validator && touched ? validateField(value, validator) : "";
  const hasError = !!error;

  const handleChange = (raw: string) => {
    if (validator === "cnpj") {
      onChange(formatCNPJ(raw));
    } else if (validator === "phone") {
      onChange(formatPhone(raw));
    } else {
      onChange(raw);
    }
  };

  const baseBorder = hasError ? "#ff6b6b" : "rgba(255,255,255,0.12)";
  const focusBorder = hasError ? "#ff6b6b" : "#C8FF4D";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        letterSpacing: "0.02em",
      }}>
        {label}{required && <span style={{ color: "#C8FF4D", marginLeft: "3px" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => {
          setTouched(true);
          e.target.style.borderColor = baseBorder;
        }}
        onFocus={(e) => (e.target.style.borderColor = focusBorder)}
        placeholder={placeholder}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${baseBorder}`,
          borderRadius: "8px",
          padding: "11px 14px",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.15s",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      {hasError && (
        <span style={{
          fontSize: "12px",
          color: "#ff6b6b",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          marginTop: "2px",
        }}>
          {error}
        </span>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        letterSpacing: "0.02em",
      }}>
        {label}{required && <span style={{ color: "#C8FF4D", marginLeft: "3px" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "#0E1219",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "8px",
          padding: "11px 14px",
          color: value ? "#fff" : "rgba(255,255,255,0.35)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          outline: "none",
          width: "100%",
          cursor: "pointer",
        }}
      >
        <option value="">Selecione...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        letterSpacing: "0.02em",
      }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "8px",
          padding: "11px 14px",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          outline: "none",
          resize: "vertical",
          width: "100%",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#C8FF4D")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
      />
    </div>
  );
}

const STEPS = [
  { num: 1, label: "Identificação" },
  { num: 2, label: "Perfil Educacional" },
  { num: 3, label: "Interesse Comercial" },
  { num: 4, label: "Contato" },
];

export default function ParceriasPage() {
  const [step, setStep] = useState(0); // 0 = landing, 1-4 = form steps, 5 = success
  const [formData, setFormData] = useState<FormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

  const set = (field: keyof FormData) => (val: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      const requiredOk = !!(formData.nomeInstituicao && formData.tipoInstituicao && formData.cidadeSede && formData.estadoSede);
      // Se CNPJ/site foram preenchidos, devem ser válidos
      const cnpjOk = !formData.cnpj || !validateField(formData.cnpj, "cnpj");
      const siteOk = !formData.site || !validateField(formData.site, "url");
      return requiredOk && cnpjOk && siteOk;
    }
    if (s === 2) {
      return !!(formData.possuiCursosPropriosBool && formData.areasAtuacao.length > 0 && formData.modalidades.length > 0);
    }
    if (s === 3) {
      return !!(formData.planoInteresse && formData.objetivoPrimario);
    }
    if (s === 4) {
      const requiredOk = !!(formData.nomeResponsavel && formData.cargoResponsavel && formData.emailResponsavel && formData.telefoneResponsavel);
      const emailOk = !validateField(formData.emailResponsavel, "email");
      const phoneOk = !validateField(formData.telefoneResponsavel, "phone");
      return requiredOk && emailOk && phoneOk;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError("Preencha todos os campos obrigatórios antes de enviar.");
      return;
    }
    setLoading(true);
    setError("");

    const templateParams = {
      to_email: "manulareo2008@gmail.com",
      instituicao: formData.nomeInstituicao,
      cnpj: formData.cnpj || "Não informado",
      site: formData.site || "Não informado",
      tipo: formData.tipoInstituicao,
      cidade: formData.cidadeSede,
      estado: formData.estadoSede,
      cursos_proprios: formData.possuiCursosPropriosBool,
      modalidades: formData.modalidades.join(", ") || "Não informado",
      areas: formData.areasAtuacao.join(", ") || "Não informado",
      publico: formData.publicoAlvo.join(", ") || "Não informado",
      num_cursos: formData.numeroCursos || "Não informado",
      plataformas: formData.plataformasParceiras || "Não informado",
      diferencial: formData.diferencialPedagogico || "Não informado",
      plano: formData.planoInteresse,
      objetivo: formData.objetivoPrimario,
      orcamento: formData.orcamentoMensal || "Não informado",
      prazo: formData.prazoDecisao || "Não informado",
      como_conheceu: formData.comoConheceu || "Não informado",
      responsavel: formData.nomeResponsavel,
      cargo: formData.cargoResponsavel,
      email: formData.emailResponsavel,
      telefone: formData.telefoneResponsavel,
      horario: formData.melhorHorario || "Não informado",
      mensagem: formData.mensagemAdicional || "Sem mensagem adicional",
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStep(5);
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Erro ao enviar o formulário. Tente novamente em alguns instantes ou entre em contato por manulareo2008@gmail.com");
    } finally {
      setLoading(false);
    }
  };

  const btnPrimary = {
    background: "#C8FF4D",
    color: "#080B10",
    border: "none",
    borderRadius: "8px",
    padding: "13px 28px",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "15px",
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "opacity 0.15s",
  } as React.CSSProperties;

  const btnSecondary = {
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    padding: "13px 24px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.15s",
  } as React.CSSProperties;

  // ─── LANDING ───────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <>
      <InternalHeader />
        <main style={{
          minHeight: "100vh",
          background: "#080B10",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}>

          {/* ── HERO ── */}
          <section style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "100px 24px 80px",
            textAlign: "center",
          }}>
            <div style={{
              display: "inline-block",
              background: "rgba(200,255,77,0.08)",
              border: "1px solid rgba(200,255,77,0.25)",
              borderRadius: "100px",
              padding: "6px 18px",
              marginBottom: "32px",
            }}>
              <span style={{ color: "#C8FF4D", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Programa de Parcerias
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(38px, 6vw, 68px)",
              lineHeight: 1.05,
              margin: "0 0 24px",
              letterSpacing: "-0.02em",
            }}>
              Coloque seus cursos<br />
              <span style={{ color: "#C8FF4D" }}>na frente de quem</span><br />
              realmente procura.
            </h1>

            <p style={{
              fontSize: "clamp(16px, 2.2vw, 19px)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: "580px",
              margin: "0 auto 48px",
              fontWeight: 300,
            }}>
              O Atloom conecta profissionais que já sabem o que querem aprender com as instituições certas. Sem scroll infinito, sem algoritmo opaco — só afinidade real entre aluno e curso.
            </p>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setStep(1)}
                style={btnPrimary}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Quero ser parceiro
              </button>
              <a
                href="mailto:manulareo2008@gmail.com"
                style={{
                  ...btnSecondary,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Falar com a equipe
              </a>
            </div>
          </section>

          {/* ── NÚMEROS ── */}
          <section style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "48px 24px",
          }}>
            <div style={{
              maxWidth: "900px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "40px",
              textAlign: "center",
            }}>
              {[
                { val: "48+", label: "Cursos curados manualmente" },
                { val: "9", label: "Áreas de conhecimento cobertas" },
                { val: "100%", label: "Gratuito para os alunos" },
                { val: "Santa Catarina", label: "Foco inicial de mercado" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "36px",
                    color: "#C8FF4D",
                    marginBottom: "6px",
                  }}>{s.val}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 300 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── COMO FUNCIONA ── */}
          <section style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 24px" }}>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ color: "#C8FF4D", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                Como funciona
              </p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 38px)", margin: 0 }}>
                Da parceria ao aluno em 4 passos
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  num: "01",
                  title: "Cadastro da instituição",
                  desc: "Você preenche o formulário de parceria com informações sobre sua instituição, cursos e objetivos. Nossa equipe analisa e entra em contato em até 48 horas úteis.",
                },
                {
                  num: "02",
                  title: "Definição do plano",
                  desc: "Escolhemos juntos o modelo mais adequado: Parceiro Destaque (listagem com badge visual e página própria) ou Spotlight Garantido (exibição interstitial no quiz, antes dos resultados).",
                },
                {
                  num: "03",
                  title: "Integração dos cursos",
                  desc: "Inserimos seus cursos no catálogo com todas as informações necessárias, alinhadas ao sistema de recomendação do quiz. Nenhum trabalho técnico necessário da sua parte.",
                },
                {
                  num: "04",
                  title: "Visibilidade e métricas",
                  desc: "Seus cursos passam a ser exibidos para alunos com alta afinidade comprovada. Você acompanha impressões, cliques e CTR no dashboard de parceiro.",
                },
              ].map((item, i, arr) => (
                <div
                  key={item.num}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: "24px",
                    padding: "32px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "32px",
                    color: "rgba(200,255,77,0.2)",
                    lineHeight: 1,
                  }}>
                    {item.num}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      margin: "0 0 10px",
                    }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.65, margin: 0, fontWeight: 300 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── PLANOS ── */}
          <section style={{
            background: "rgba(255,255,255,0.02)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "80px 24px",
          }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div style={{ marginBottom: "48px", textAlign: "center" }}>
                <p style={{ color: "#C8FF4D", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Planos
                </p>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 38px)", margin: "0 0 12px" }}>
                  Dois modelos, um objetivo
                </h2>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px", fontWeight: 300 }}>
                  Valores definidos em conversa — dependem do volume de cursos e objetivos da instituição.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                {[
                  {
                    tag: "Parceiro Destaque",
                    color: "#4DFFC8",
                    items: [
                      "Badge visual exclusivo nos cards de resultado",
                      "Página de perfil institucional própria (/parcerias/sua-instituicao)",
                      "Prioridade de exibição no catálogo orgânico",
                      "Dashboard básico: impressões e cliques",
                      "Suporte direto via WhatsApp",
                    ],
                    ideal: "Ideal para instituições que querem presença contínua e construção de marca.",
                  },
                  {
                    tag: "Spotlight Garantido",
                    color: "#C8FF4D",
                    items: [
                      "Tudo do Parceiro Destaque",
                      "Exibição interstitial entre o quiz e os resultados",
                      "Garantia de visualização para cada aluno que completa o quiz",
                      "Dashboard avançado: funil completo com CTR por curso",
                      "Relatório mensal de performance",
                    ],
                    ideal: "Ideal para quem quer máxima exposição no momento exato de decisão do aluno.",
                  },
                ].map((plan) => (
                  <div
                    key={plan.tag}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${plan.color}33`,
                      borderRadius: "12px",
                      padding: "32px",
                    }}
                  >
                    <div style={{
                      display: "inline-block",
                      background: `${plan.color}15`,
                      border: `1px solid ${plan.color}40`,
                      borderRadius: "100px",
                      padding: "4px 14px",
                      marginBottom: "24px",
                    }}>
                      <span style={{ color: plan.color, fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em" }}>
                        {plan.tag}
                      </span>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {plan.items.map((item) => (
                        <li key={item} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.65)", fontWeight: 300, lineHeight: 1.5 }}>
                          <span style={{ color: plan.color, flexShrink: 0, marginTop: "2px" }}>—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
                      {plan.ideal}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 24px" }}>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ color: "#C8FF4D", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                Perguntas frequentes
              </p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3.5vw, 34px)", margin: 0 }}>
                Antes de se cadastrar
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  q: "Qualquer tipo de instituição pode se tornar parceira?",
                  a: "Sim. Atendemos desde escolas técnicas e faculdades até plataformas digitais, bootcamps e criadores independentes de cursos. O único critério é ter conteúdo educacional relevante para o nosso catálogo.",
                },
                {
                  q: "Quanto tempo leva para meus cursos aparecerem no site?",
                  a: "Após a assinatura do acordo de parceria, a integração dos cursos leva entre 3 e 5 dias úteis. Para o Spotlight, aguardamos a próxima janela disponível na rotação.",
                },
                {
                  q: "Preciso fornecer acesso técnico à minha plataforma?",
                  a: "Não. Toda a integração é feita pela nossa equipe com base nas informações que você fornecer no formulário e em conversa posterior. Nenhum acesso de sistema é necessário.",
                },
                {
                  q: "Posso cancelar a parceria a qualquer momento?",
                  a: "Sim. Trabalhamos com contratos mensais renováveis. O cancelamento deve ser solicitado com 15 dias de antecedência antes da renovação.",
                },
                {
                  q: "Os alunos sabem que determinado curso é de um parceiro pago?",
                  a: "Sim, total transparência. Cursos de parceiros exibem um badge visual identificado. Acreditamos que honestidade com o aluno é o que mantém a credibilidade da plataforma — e, por consequência, o valor da parceria.",
                },
              ].map((item, i, arr) => (
                <FaqItem key={item.q} q={item.q} a={item.a} last={i === arr.length - 1} />
              ))}
            </div>
          </section>

          {/* ── CTA FINAL ── */}
          <section style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "80px 24px 100px",
            textAlign: "center",
          }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 46px)",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}>
              Pronto para começar?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", fontWeight: 300, margin: "0 0 40px" }}>
              Preencha o formulário em menos de 5 minutos. Nossa equipe retorna em até 48 horas úteis.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setStep(1)}
                style={btnPrimary}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Cadastrar minha instituição
              </button>
              <a
                href="mailto:manulareo2008@gmail.com"
                style={{
                  ...btnSecondary,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                manulareo2008@gmail.com
              </a>
            </div>
          </section>

        </main>
        <ParceriasFooter />
      </>
    );
  }

  // ─── SUCCESS ───────────────────────────────────────────────────────────────
  if (step === 5) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#080B10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "40px 24px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(200,255,77,0.1)",
          border: "1px solid rgba(200,255,77,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "26px",
        }}>
          ✓
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(28px, 5vw, 42px)",
          margin: "0 0 16px",
          color: "#fff",
        }}>
          Cadastro enviado com sucesso
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", fontWeight: 300, maxWidth: "460px", lineHeight: 1.65, margin: "0 auto 12px" }}>
          Recebemos as informações de <strong style={{ color: "#fff" }}>{formData.nomeInstituicao}</strong>. Nossa equipe vai analisar e entrar em contato com {formData.emailResponsavel} em até 48 horas úteis.
        </p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", margin: "0 0 40px" }}>
          Dúvidas urgentes: manulareo2008@gmail.com
        </p>
        <a href="/" style={{
          ...btnPrimary,
          textDecoration: "none",
          display: "inline-block",
        }}>
          Voltar para o início
        </a>
      </main>
    );
  }

  // ─── FORM ─────────────────────────────────────────────────────────────────
  const currentStep = step; // 1–4
  const progress = ((currentStep - 1) / 4) * 100;

  return (
    <>
      <main style={{
        minHeight: "100vh",
        background: "#080B10",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        padding: "0 0 80px",
      }}>
        {/* Progress Header */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(8,11,16,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 24px",
        }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "16px 0" }}>
            {/* Steps */}
            <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "14px" }}>
              {STEPS.map((s, i) => {
                const done = currentStep > s.num;
                const active = currentStep === s.num;
                return (
                  <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <div style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: done ? "#C8FF4D" : active ? "rgba(200,255,77,0.15)" : "rgba(255,255,255,0.06)",
                        border: active ? "1.5px solid #C8FF4D" : done ? "none" : "1px solid rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: done ? "#080B10" : active ? "#C8FF4D" : "rgba(255,255,255,0.3)",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}>
                        {done ? "✓" : s.num}
                      </div>
                      <span style={{
                        fontSize: "12px",
                        color: active ? "#fff" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
                        fontWeight: active ? 500 : 400,
                        whiteSpace: "nowrap",
                      }}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{
                        flex: 1,
                        height: "1px",
                        background: done ? "rgba(200,255,77,0.3)" : "rgba(255,255,255,0.08)",
                        margin: "0 12px",
                        transition: "background 0.3s",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Bar */}
            <div style={{ height: "2px", background: "rgba(255,255,255,0.07)", borderRadius: "2px" }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "#C8FF4D",
                borderRadius: "2px",
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "56px 24px 0" }}>

          {/* ── STEP 1: Identificação ── */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 30px)", margin: "0 0 8px" }}>
                Sobre a sua instituição
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 300, margin: "0 0 40px" }}>
                Precisamos entender quem você é antes de conversar sobre parceria.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Input label="Nome da instituição" value={formData.nomeInstituicao} onChange={set("nomeInstituicao")} placeholder="Ex: Instituto Digital BR" required />

                <Select
                  label="Tipo de instituição"
                  value={formData.tipoInstituicao}
                  onChange={set("tipoInstituicao")}
                  required
                  options={[
                    { value: "escola_tecnica", label: "Escola técnica / profissionalizante" },
                    { value: "faculdade", label: "Faculdade / Universidade" },
                    { value: "plataforma_ead", label: "Plataforma EAD (SaaS de cursos)" },
                    { value: "bootcamp", label: "Bootcamp / escola intensiva" },
                    { value: "criador_independente", label: "Criador independente de cursos" },
                    { value: "empresa_treinamento", label: "Empresa de treinamento corporativo" },
                    { value: "ong_instituto", label: "ONG / Instituto sem fins lucrativos" },
                    { value: "outro", label: "Outro" },
                  ]}
                />

                <Input label="CNPJ" value={formData.cnpj} onChange={set("cnpj")} placeholder="00.000.000/0001-00" validator="cnpj" />

                <Input label="Site institucional" value={formData.site} onChange={set("site")} placeholder="https://suainstituicao.com.br" type="url" validator="url" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px" }}>
                  <Input label="Cidade sede" value={formData.cidadeSede} onChange={set("cidadeSede")} placeholder="Ex: Florianópolis" required />
                  <Select
                    label="Estado"
                    value={formData.estadoSede}
                    onChange={set("estadoSede")}
                    required
                    options={["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(s => ({ value: s, label: s }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Perfil Educacional ── */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 30px)", margin: "0 0 8px" }}>
                Perfil educacional
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 300, margin: "0 0 40px" }}>
                O que você ensina e como você ensina define como vamos posicioná-lo no catálogo.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

                <Select
                  label="Sua instituição possui cursos próprios ou representa outros?"
                  value={formData.possuiCursosPropriosBool}
                  onChange={set("possuiCursosPropriosBool")}
                  required
                  options={[
                    { value: "proprios", label: "Cursos totalmente próprios (conteúdo produzido internamente)" },
                    { value: "representa", label: "Representa/revende cursos de terceiros" },
                    { value: "ambos", label: "Ambos — cursos próprios e de parceiros" },
                    { value: "franquia", label: "Franquia de uma rede educacional" },
                  ]}
                />

                <div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 300, marginBottom: "12px" }}>
                    Áreas de atuação <span style={{ color: "#C8FF4D" }}>*</span>
                  </p>
                  <CheckboxGroup
                    options={AREAS}
                    selected={formData.areasAtuacao}
                    onChange={(v) => set("areasAtuacao")(v)}
                  />
                </div>

                <div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 300, marginBottom: "12px" }}>
                    Modalidades de ensino oferecidas <span style={{ color: "#C8FF4D" }}>*</span>
                  </p>
                  <CheckboxGroup
                    options={MODALIDADES}
                    selected={formData.modalidades}
                    onChange={(v) => set("modalidades")(v)}
                  />
                </div>

                <div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 300, marginBottom: "12px" }}>
                    Público-alvo principal
                  </p>
                  <CheckboxGroup
                    options={PUBLICO}
                    selected={formData.publicoAlvo}
                    onChange={(v) => set("publicoAlvo")(v)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Select
                    label="Número aproximado de cursos ativos"
                    value={formData.numeroCursos}
                    onChange={set("numeroCursos")}
                    options={[
                      { value: "1-5", label: "1 a 5 cursos" },
                      { value: "6-20", label: "6 a 20 cursos" },
                      { value: "21-50", label: "21 a 50 cursos" },
                      { value: "51-100", label: "51 a 100 cursos" },
                      { value: "100+", label: "Mais de 100 cursos" },
                    ]}
                  />
                </div>

                <Input
                  label="Plataformas parceiras (Hotmart, Udemy, Eduzz, própria, etc.)"
                  value={formData.plataformasParceiras}
                  onChange={set("plataformasParceiras")}
                  placeholder="Ex: Plataforma própria + Hotmart"
                />

                <Textarea
                  label="Qual é o principal diferencial pedagógico da sua instituição?"
                  value={formData.diferencialPedagogico}
                  onChange={set("diferencialPedagogico")}
                  placeholder="Ex: Metodologia hands-on com projetos reais, mentoria individual incluída, certificação reconhecida pelo MEC..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Interesse Comercial ── */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 30px)", margin: "0 0 8px" }}>
                Interesse comercial
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 300, margin: "0 0 40px" }}>
                Entender seu objetivo nos ajuda a propor o modelo de parceria mais eficiente para você.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                <div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 300, marginBottom: "12px" }}>
                    Plano de interesse <span style={{ color: "#C8FF4D" }}>*</span>
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      {
                        val: "destaque",
                        title: "Parceiro Destaque",
                        desc: "Badge visual, página própria, prioridade no catálogo, dashboard básico",
                      },
                      {
                        val: "spotlight",
                        title: "Spotlight Garantido",
                        desc: "Tudo do Destaque + interstitial exclusivo entre quiz e resultados",
                      },
                      {
                        val: "nao_sei",
                        title: "Ainda não sei — quero orientação",
                        desc: "Prefiro que a equipe me recomende o melhor plano após conversa",
                      },
                    ].map((plan) => {
                      const active = formData.planoInteresse === plan.val;
                      return (
                        <button
                          key={plan.val}
                          type="button"
                          onClick={() => set("planoInteresse")(plan.val)}
                          style={{
                            padding: "16px 20px",
                            borderRadius: "10px",
                            border: active ? "1.5px solid #C8FF4D" : "1px solid rgba(255,255,255,0.1)",
                            background: active ? "rgba(200,255,77,0.06)" : "rgba(255,255,255,0.02)",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            border: active ? "5px solid #C8FF4D" : "1.5px solid rgba(255,255,255,0.25)",
                            flexShrink: 0,
                            transition: "all 0.15s",
                          }} />
                          <div>
                            <div style={{ color: active ? "#C8FF4D" : "#fff", fontSize: "14px", fontWeight: 500, marginBottom: "3px" }}>
                              {plan.title}
                            </div>
                            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 300 }}>
                              {plan.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Select
                  label="Principal objetivo com a parceria"
                  value={formData.objetivoPrimario}
                  onChange={set("objetivoPrimario")}
                  required
                  options={[
                    { value: "captacao_alunos", label: "Captar novos alunos qualificados" },
                    { value: "reconhecimento_marca", label: "Aumentar reconhecimento de marca" },
                    { value: "expansao_sc", label: "Expandir presença em Santa Catarina" },
                    { value: "testar_canal", label: "Testar um novo canal de aquisição" },
                    { value: "complementar_estrategia", label: "Complementar estratégia de marketing existente" },
                  ]}
                />

                <Select
                  label="Orçamento mensal aproximado para aquisição de alunos"
                  value={formData.orcamentoMensal}
                  onChange={set("orcamentoMensal")}
                  options={[
                    { value: "ate_500", label: "Até R$ 500 / mês" },
                    { value: "500_2000", label: "R$ 500 a R$ 2.000 / mês" },
                    { value: "2000_5000", label: "R$ 2.000 a R$ 5.000 / mês" },
                    { value: "5000_mais", label: "Acima de R$ 5.000 / mês" },
                    { value: "prefiro_nao_informar", label: "Prefiro não informar agora" },
                  ]}
                />

                <Select
                  label="Prazo para tomar decisão sobre a parceria"
                  value={formData.prazoDecisao}
                  onChange={set("prazoDecisao")}
                  options={[
                    { value: "imediato", label: "Imediato — quero começar o quanto antes" },
                    { value: "15_dias", label: "Nos próximos 15 dias" },
                    { value: "30_dias", label: "No próximo mês" },
                    { value: "explorando", label: "Apenas explorando por enquanto" },
                  ]}
                />

                <Select
                  label="Como ficou sabendo do Atloom?"
                  value={formData.comoConheceu}
                  onChange={set("comoConheceu")}
                  options={[
                    { value: "google", label: "Busca no Google" },
                    { value: "indicacao", label: "Indicação de contato" },
                    { value: "redes_sociais", label: "Redes sociais" },
                    { value: "evento", label: "Evento / conferência" },
                    { value: "outro", label: "Outro" },
                  ]}
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Contato ── */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 30px)", margin: "0 0 8px" }}>
                Responsável pelo contato
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 300, margin: "0 0 40px" }}>
                Quem deve receber nosso retorno sobre a proposta de parceria?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Input label="Nome completo" value={formData.nomeResponsavel} onChange={set("nomeResponsavel")} placeholder="Ex: Ana Carolina Silva" required />
                  <Input label="Cargo / função" value={formData.cargoResponsavel} onChange={set("cargoResponsavel")} placeholder="Ex: Diretora de Marketing" required />
                </div>
                <Input label="E-mail profissional" value={formData.emailResponsavel} onChange={set("emailResponsavel")} placeholder="nome@suainstituicao.com.br" type="email" required validator="email" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <Input label="Telefone / WhatsApp" value={formData.telefoneResponsavel} onChange={set("telefoneResponsavel")} placeholder="(48) 99999-9999" required validator="phone" />
                  <Select
                    label="Melhor horário para contato"
                    value={formData.melhorHorario}
                    onChange={set("melhorHorario")}
                    options={[
                      { value: "manha", label: "Manhã (08h – 12h)" },
                      { value: "tarde", label: "Tarde (12h – 18h)" },
                      { value: "qualquer", label: "Qualquer horário comercial" },
                    ]}
                  />
                </div>
                <Textarea
                  label="Mensagem adicional (opcional)"
                  value={formData.mensagemAdicional}
                  onChange={set("mensagemAdicional")}
                  placeholder="Algum contexto adicional, dúvida específica ou pedido especial que queira incluir..."
                  rows={4}
                />

                {/* Resumo */}
                <div style={{
                  background: "rgba(200,255,77,0.04)",
                  border: "1px solid rgba(200,255,77,0.15)",
                  borderRadius: "10px",
                  padding: "20px",
                  marginTop: "8px",
                }}>
                  <p style={{ color: "#C8FF4D", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 14px" }}>
                    Resumo do cadastro
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {[
                      { l: "Instituição", v: formData.nomeInstituicao },
                      { l: "Tipo", v: formData.tipoInstituicao },
                      { l: "Localização", v: `${formData.cidadeSede}, ${formData.estadoSede}` },
                      { l: "Plano de interesse", v: formData.planoInteresse },
                      { l: "Objetivo", v: formData.objetivoPrimario },
                      { l: "Áreas", v: formData.areasAtuacao.slice(0, 2).join(", ") + (formData.areasAtuacao.length > 2 ? ` +${formData.areasAtuacao.length - 2}` : "") },
                    ].map((r) => (
                      <div key={r.l}>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", display: "block" }}>{r.l}</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>{r.v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{
                    background: "rgba(255,80,80,0.08)",
                    border: "1px solid rgba(255,80,80,0.25)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#ff6b6b",
                    fontSize: "13px",
                  }}>
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}>
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={btnSecondary}
            >
              {currentStep === 1 ? "Voltar ao início" : "Etapa anterior"}
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateStep(currentStep)) {
                    setStep((s) => s + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    setError("Preencha os campos obrigatórios e corrija os erros antes de continuar.");
                    setTimeout(() => setError(""), 3500);
                  }
                }}
                style={btnPrimary}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Próxima etapa
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{ ...btnPrimary, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Enviando..." : "Enviar cadastro"}
              </button>
            )}
          </div>
        </div>
      </main>
      <ParceriasFooter />
    </>
  );
}

function FaqItem({ q, a, last }: { q: string; a: string; last: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "transparent",
          border: "none",
          color: "#fff",
          padding: "20px 0",
          cursor: "pointer",
          textAlign: "left",
          gap: "16px",
        }}
      >
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "15px", lineHeight: 1.4 }}>{q}</span>
        <span style={{
          color: "#C8FF4D",
          fontSize: "20px",
          flexShrink: 0,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          lineHeight: 1,
        }}>+</span>
      </button>
      {open && (
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "14px",
          fontWeight: 300,
          lineHeight: 1.7,
          margin: "0 0 20px",
          paddingRight: "32px",
        }}>
          {a}
        </p>
      )}
    </div>
  );
}

function ParceriasFooter() {
  return (
    <footer style={{
      background: "#05070B",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      color: "rgba(255,255,255,0.5)",
      fontFamily: "'DM Sans', sans-serif",
      padding: "64px 24px 32px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Linha 1 — Brand + Colunas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "48px",
          marginBottom: "48px",
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "22px",
              color: "#fff",
              letterSpacing: "-0.01em",
              marginBottom: "14px",
            }}>
              Atloom
            </div>
            <p style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.4)",
              fontWeight: 300,
              margin: 0,
              maxWidth: "260px",
            }}>
              Plataforma de descoberta de cursos profissionalizantes. Curadoria humana, recomendação por afinidade, gratuito para alunos.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <p style={{
              fontSize: "11px",
              color: "#C8FF4D",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}>
              Plataforma
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <FooterLink href="/quiz" label="Quiz" />
              <FooterLink href="/guias" label="Guias" />
              <FooterLink href="/planos" label="Planos" />
              <FooterLink href="/parcerias" label="Parcerias" />
            </ul>
          </div>

          {/* Para parceiros */}
          <div>
            <p style={{
              fontSize: "11px",
              color: "#C8FF4D",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}>
              Para parceiros
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <FooterLink href="/parcerias" label="Cadastrar instituição" />
              <FooterLink href="/parcerias#planos" label="Planos de parceria" />
              <FooterLink href="/parcerias#faq" label="Perguntas frequentes" />
              <FooterLink href="/contato" label="Falar com a equipe" />
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p style={{
              fontSize: "11px",
              color: "#C8FF4D",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}>
              Legal
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <FooterLink href="/privacidade" label="Política de privacidade" />
              <FooterLink href="/termos" label="Termos de uso" />
            </ul>
            <p style={{
              fontSize: "11px",
              color: "#C8FF4D",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: "28px",
              marginBottom: "12px",
            }}>
              Contato
            </p>
            <a
              href="mailto:manulareo2008@gmail.com"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                textDecoration: "none",
                fontWeight: 300,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C8FF4D")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >
              manulareo2008@gmail.com
            </a>
          </div>
        </div>

        {/* Linha 2 — Bottom bar */}
        <div style={{
          paddingTop: "28px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <p style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
            margin: 0,
            fontWeight: 300,
          }}>
            © 2026 Atloom. Todos os direitos reservados.
          </p>
          <p style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
            margin: 0,
            fontWeight: 300,
          }}>
            Feito em <span style={{ color: "#C8FF4D" }}>Santa Catarina</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "13px",
          textDecoration: "none",
          fontWeight: 300,
          transition: "color 0.15s",
          display: "inline-block",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#C8FF4D")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
      >
        {label}
      </Link>
    </li>
  );
}
