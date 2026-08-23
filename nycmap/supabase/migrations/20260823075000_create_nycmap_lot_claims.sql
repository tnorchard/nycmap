-- NYC MAP: digital lot ownership + Stripe webhook idempotency

CREATE TABLE IF NOT EXISTS public.nycmap_lot_claims (
  block_id text PRIMARY KEY,
  tax_block integer NOT NULL DEFAULT 0,
  neighborhood_id text NOT NULL DEFAULT '',
  neighborhood_name text NOT NULL DEFAULT '',
  owner_name text NOT NULL,
  owner_url text NOT NULL,
  owner_image text NOT NULL DEFAULT '',
  owner_color text NOT NULL DEFAULT '#141414',
  price numeric(12,2) NOT NULL CHECK (price > 0),
  purchased_at timestamptz NOT NULL DEFAULT now(),
  stripe_session_id text NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS nycmap_lot_claims_neighborhood_id_idx
  ON public.nycmap_lot_claims (neighborhood_id);

CREATE INDEX IF NOT EXISTS nycmap_lot_claims_purchased_at_idx
  ON public.nycmap_lot_claims (purchased_at DESC);

CREATE TABLE IF NOT EXISTS public.nycmap_processed_checkout_sessions (
  stripe_session_id text PRIMARY KEY,
  block_id text,
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nycmap_lot_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nycmap_processed_checkout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "nycmap_lot_claims_public_read" ON public.nycmap_lot_claims;
CREATE POLICY "nycmap_lot_claims_public_read"
  ON public.nycmap_lot_claims
  FOR SELECT
  TO anon, authenticated
  USING (true);

COMMENT ON TABLE public.nycmap_lot_claims IS
  'Current owner of each NYC MAP lot. Writes via service role only (Stripe webhook).';
COMMENT ON TABLE public.nycmap_processed_checkout_sessions IS
  'Stripe Checkout session ids already handled (idempotency).';
