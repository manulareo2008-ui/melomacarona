-- Tabela de tracking de cliques em links de afiliado
-- Executar no Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id       text        NOT NULL,
  affiliate_link text        NOT NULL,
  user_id        uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_id        text,
  pagina_origem  text        NOT NULL DEFAULT 'acessando-curso',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS affiliate_clicks_curso_id_idx  ON affiliate_clicks (curso_id);
CREATE INDEX IF NOT EXISTS affiliate_clicks_created_at_idx ON affiliate_clicks (created_at DESC);

-- RLS: somente service_role escreve; leitura bloqueada para anonimos
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role full access" ON affiliate_clicks
  FOR ALL USING (auth.role() = 'service_role');
