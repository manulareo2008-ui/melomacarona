"use client";

import { useCallback, useEffect, useState } from "react";
import { GENERAL_AREAS, type GeneralArea } from "@/lib/domain";

const TIPO_LABELS: Record<string, string> = {
  instituicao: "Instituição",
  professor: "Professor",
  plataforma: "Plataforma",
};

const AREA_LABELS: Record<string, string> = {
  technology: "Tecnologia",
  health: "Saúde",
  humanities: "Humanas",
  arts_design: "Artes e Design",
  business_admin: "Negócios",
  engineering: "Engenharia",
};

const AREA_COLORS: Record<string, string> = {
  technology: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  health: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  humanities: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  arts_design: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  business_admin: "bg-green-500/20 text-green-300 border-green-500/30",
  engineering: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

function areaBadgeClass(area: string): string {
  return (
    AREA_COLORS[area] ?? "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
  );
}

export type PatrocinadorRow = {
  id: string;
  nome: string;
  tipo: string;
  logo_url: string | null;
  site_url: string | null;
  cidades_cobertura: string[] | null;
  estados_cobertura: string[] | null;
  areas_foco: string[] | null;
  contato_nome: string | null;
  contato_email: string | null;
  ativo: boolean | null;
  criado_em: string;
  links_por_area?: Record<string, string> | null;
};

function splitCommaList(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const inputClass =
  "w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600";
const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5";

const cardShell =
  "rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-sm";

const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500";
const btnSecondary =
  "inline-flex items-center justify-center rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700";

export function AdminPatrocinadores() {
  const [lista, setLista] = useState<PatrocinadorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"instituicao" | "professor" | "plataforma">(
    "instituicao"
  );
  const [siteUrl, setSiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [cidadesText, setCidadesText] = useState("");
  const [estadosText, setEstadosText] = useState("");
  const [areasSel, setAreasSel] = useState<Record<GeneralArea, boolean>>(() =>
    Object.fromEntries(GENERAL_AREAS.map((a) => [a, false])) as Record<
      GeneralArea,
      boolean
    >
  );
  const [contatoNome, setContatoNome] = useState("");
  const [contatoEmail, setContatoEmail] = useState("");
  const [linksPorAreaJson, setLinksPorAreaJson] = useState("");

  const loadLista = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/patrocinadores", {
        credentials: "include",
      });
      const json = (await res.json()) as
        | { ok: true; patrocinadores: PatrocinadorRow[] }
        | { ok: false; error?: string };
      if (!res.ok || !json.ok) {
        setError(
          !json.ok && "error" in json && json.error
            ? json.error
            : "Não foi possível carregar patrocinadores."
        );
        setLista([]);
        return;
      }
      setLista(json.patrocinadores);
    } catch {
      setError("Falha de rede ao carregar patrocinadores.");
      setLista([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLista();
  }, [loadLista]);

  function resetForm() {
    setNome("");
    setTipo("instituicao");
    setSiteUrl("");
    setLogoUrl("");
    setCidadesText("");
    setEstadosText("");
    setAreasSel(
      Object.fromEntries(GENERAL_AREAS.map((a) => [a, false])) as Record<
        GeneralArea,
        boolean
      >
    );
    setContatoNome("");
    setContatoEmail("");
    setLinksPorAreaJson("");
    setFormError(null);
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    resetForm();
  }

  function fillFromRow(p: PatrocinadorRow) {
    setNome(p.nome);
    setTipo(
      p.tipo === "professor" || p.tipo === "plataforma"
        ? p.tipo
        : "instituicao"
    );
    setSiteUrl(p.site_url ?? "");
    setLogoUrl(p.logo_url ?? "");
    setCidadesText((p.cidades_cobertura ?? []).join(", "));
    setEstadosText((p.estados_cobertura ?? []).join(", "));
    const nextAreas = Object.fromEntries(
      GENERAL_AREAS.map((a) => [a, (p.areas_foco ?? []).includes(a)])
    ) as Record<GeneralArea, boolean>;
    setAreasSel(nextAreas);
    setContatoNome(p.contato_nome ?? "");
    setContatoEmail(p.contato_email ?? "");
    setLinksPorAreaJson(
      p.links_por_area && Object.keys(p.links_por_area).length > 0
        ? JSON.stringify(p.links_por_area, null, 2)
        : ""
    );
    setFormError(null);
    setEditingId(p.id);
    setFormOpen(true);
  }

  function toggleArea(area: GeneralArea) {
    setAreasSel((prev) => ({ ...prev, [area]: !prev[area] }));
  }

  function parseLinksPorAreaField():
    | { ok: true; value: Record<string, string> | undefined }
    | { ok: false; message: string } {
    const raw = linksPorAreaJson.trim();
    if (!raw) return { ok: true, value: undefined };
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return { ok: false, message: "Links por área: JSON deve ser um objeto." };
      }
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        if (!GENERAL_AREAS.includes(k as GeneralArea)) continue;
        if (typeof v !== "string" || !v.trim()) continue;
        out[k] = v.trim();
      }
      return { ok: true, value: Object.keys(out).length > 0 ? out : undefined };
    } catch {
      return { ok: false, message: "Links por área: JSON inválido." };
    }
  }

  async function handleSalvar() {
    setSaving(true);
    setFormError(null);
    const cidades_cobertura = splitCommaList(cidadesText);
    const estados_cobertura = splitCommaList(estadosText);
    const areas_foco = GENERAL_AREAS.filter((a) => areasSel[a]);
    const linksParsed = parseLinksPorAreaField();
    if (!linksParsed.ok) {
      setFormError(linksParsed.message);
      setSaving(false);
      return;
    }
    const links_por_area = linksParsed.value;

    const payloadCreate = {
      nome: nome.trim(),
      tipo,
      site_url: siteUrl.trim() || undefined,
      logo_url: logoUrl.trim() || undefined,
      cidades_cobertura,
      estados_cobertura,
      areas_foco,
      contato_nome: contatoNome.trim() || undefined,
      contato_email: contatoEmail.trim() || undefined,
      ...(links_por_area ? { links_por_area } : {}),
    };

    const payloadPatch = {
      nome: nome.trim(),
      tipo,
      site_url: siteUrl.trim() === "" ? null : siteUrl.trim(),
      logo_url: logoUrl.trim() === "" ? null : logoUrl.trim(),
      cidades_cobertura,
      estados_cobertura,
      areas_foco,
      contato_nome: contatoNome.trim() === "" ? null : contatoNome.trim(),
      contato_email: contatoEmail.trim() === "" ? null : contatoEmail.trim(),
      links_por_area: links_por_area ?? {},
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/patrocinadores/${editingId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadPatch),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) {
          setFormError(json.error ?? "Erro ao atualizar.");
          return;
        }
      } else {
        const res = await fetch("/api/admin/patrocinadores", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadCreate),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) {
          setFormError(json.error ?? "Erro ao criar.");
          return;
        }
      }
      closeForm();
      await loadLista();
    } catch {
      setFormError("Falha de rede ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDesativar(p: PatrocinadorRow) {
    if (
      !window.confirm(
        `Remover "${p.nome}" da lista de patrocinadores ativos? Ele deixará de aparecer no painel e nas recomendações (não será possível reativar por aqui).`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/patrocinadores/${p.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = (await res.json()) as { ok?: boolean };
      if (!res.ok || !json.ok) {
        setError("Não foi possível desativar.");
        return;
      }
      await loadLista();
    } catch {
      setError("Falha de rede ao desativar.");
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Patrocinadores
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Gerencie instituições parceiras que aparecem nas recomendações.
          </p>
        </div>
        <button type="button" onClick={openCreate} className={btnPrimary}>
          Adicionar patrocinador
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {formOpen && (
        <div className={`${cardShell} space-y-4`}>
          <h3 className="text-lg font-semibold text-zinc-100">
            {editingId ? "Editar patrocinador" : "Novo patrocinador"}
          </h3>
          {formError && (
            <p className="text-sm text-red-400">{formError}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="pat-nome" className={labelClass}>
                Nome da instituição
              </label>
              <input
                id="pat-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="pat-tipo" className={labelClass}>
                Tipo
              </label>
              <select
                id="pat-tipo"
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value as typeof tipo)
                }
                className={inputClass}
              >
                <option value="instituicao">Instituição</option>
                <option value="professor">Professor</option>
                <option value="plataforma">Plataforma</option>
              </select>
            </div>
            <div>
              <label htmlFor="pat-site" className={labelClass}>
                Site oficial
              </label>
              <input
                id="pat-site"
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pat-logo" className={labelClass}>
                Logo URL
              </label>
              <input
                id="pat-logo"
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pat-cidades" className={labelClass}>
                Cidades de cobertura
              </label>
              <input
                id="pat-cidades"
                type="text"
                value={cidadesText}
                onChange={(e) => setCidadesText(e.target.value)}
                placeholder="Blumenau, Joinville, Florianópolis"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pat-estados" className={labelClass}>
                Estados de cobertura
              </label>
              <input
                id="pat-estados"
                type="text"
                value={estadosText}
                onChange={(e) => setEstadosText(e.target.value)}
                placeholder="SC, PR, SP"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pat-links-area" className={labelClass}>
                Links por área no site (JSON opcional)
              </label>
              <textarea
                id="pat-links-area"
                value={linksPorAreaJson}
                onChange={(e) => setLinksPorAreaJson(e.target.value)}
                rows={5}
                placeholder={`{\n  "technology": "https://exemplo.edu.br/cursos/tecnologia",\n  "health": "https://exemplo.edu.br/saude"\n}`}
                className={`${inputClass} font-mono text-xs`}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Chaves: {GENERAL_AREAS.join(", ")}. Usado ao redirecionar o aluno à seção do site correspondente à
                área escolhida.
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className={labelClass}>Áreas de foco</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {GENERAL_AREAS.map((area) => (
                  <label
                    key={area}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-200"
                  >
                    <input
                      type="checkbox"
                      checked={areasSel[area]}
                      onChange={() => toggleArea(area)}
                      className="rounded border-zinc-600 text-emerald-600"
                    />
                    {AREA_LABELS[area] ?? area}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="pat-contato-nome" className={labelClass}>
                Nome do contato
              </label>
              <input
                id="pat-contato-nome"
                type="text"
                value={contatoNome}
                onChange={(e) => setContatoNome(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="pat-contato-email" className={labelClass}>
                E-mail do contato
              </label>
              <input
                id="pat-contato-email"
                type="email"
                value={contatoEmail}
                onChange={(e) => setContatoEmail(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => void handleSalvar()}
              disabled={saving || !nome.trim()}
              className={`${btnPrimary} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {saving ? "Salvando…" : "Salvar"}
            </button>
            <button type="button" onClick={closeForm} className={btnSecondary}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-zinc-500">Carregando…</p>
      ) : lista.length === 0 ? (
        <p className="text-sm text-zinc-400">
          Nenhum patrocinador cadastrado. Clique em &apos;Adicionar&apos; para
          começar.
        </p>
      ) : (
        <ul className="grid gap-4">
          {lista.map((p) => (
            <li key={p.id} className={cardShell}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {p.nome}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                      {TIPO_LABELS[p.tipo] ?? p.tipo}
                    </span>
                    <span className="inline-flex rounded-full border border-emerald-500/35 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                      Ativo
                    </span>
                  </div>
                  {p.site_url && (
                    <p className="mt-2 text-sm">
                      <a
                        href={p.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 underline-offset-2 hover:text-emerald-300 hover:underline"
                      >
                        {p.site_url}
                      </a>
                    </p>
                  )}
                  {(p.cidades_cobertura?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-xs text-zinc-500">Cidades:</span>
                      {(p.cidades_cobertura ?? []).map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-zinc-600 bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-300"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  {(p.estados_cobertura?.length ?? 0) > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-xs text-zinc-500">Estados:</span>
                      {(p.estados_cobertura ?? []).map((e) => (
                        <span
                          key={e}
                          className="rounded-full border border-zinc-600 bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-300"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
                  {(p.areas_foco?.length ?? 0) > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(p.areas_foco ?? []).map((a) => (
                        <span
                          key={a}
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${areaBadgeClass(a)}`}
                        >
                          {AREA_LABELS[a] ?? a}
                        </span>
                      ))}
                    </div>
                  )}
                  {(p.contato_nome || p.contato_email) && (
                    <p className="mt-3 text-sm text-zinc-400">
                      Contato:{" "}
                      <span className="text-zinc-200">
                        {[p.contato_nome, p.contato_email]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                  <button
                    type="button"
                    onClick={() => fillFromRow(p)}
                    className={`${btnSecondary} text-sm`}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDesativar(p)}
                    className="rounded-full px-3 py-1.5 text-sm text-red-400 hover:text-red-300"
                  >
                    Remover da lista
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
