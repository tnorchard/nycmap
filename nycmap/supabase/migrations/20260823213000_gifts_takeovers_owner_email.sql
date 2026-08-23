ALTER TABLE public.nycmap_lot_claims
  ADD COLUMN IF NOT EXISTS owner_email text NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS public.nycmap_lot_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE NOT NULL,
  stripe_payment_intent_id text,
  block_id text NOT NULL,
  tax_block integer NOT NULL DEFAULT 0,
  neighborhood_id text NOT NULL DEFAULT '',
  neighborhood_name text NOT NULL DEFAULT '',
  borough text NOT NULL DEFAULT '',
  owner_name text NOT NULL,
  owner_url text NOT NULL DEFAULT '',
  owner_image text NOT NULL DEFAULT '',
  owner_color text NOT NULL DEFAULT '#141414',
  owner_email text NOT NULL DEFAULT '',
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  kind text NOT NULL CHECK (kind IN ('claim', 'takeover', 'refunded_too_low', 'gift')),
  previous_owner_name text,
  previous_owner_email text,
  previous_price numeric(12,2),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS nycmap_lot_transactions_block_id_idx
  ON public.nycmap_lot_transactions (block_id, created_at DESC);
CREATE INDEX IF NOT EXISTS nycmap_lot_transactions_created_at_idx
  ON public.nycmap_lot_transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS nycmap_lot_transactions_kind_idx
  ON public.nycmap_lot_transactions (kind, created_at DESC);

ALTER TABLE public.nycmap_lot_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nycmap_lot_transactions_public_read ON public.nycmap_lot_transactions;
CREATE POLICY nycmap_lot_transactions_public_read
  ON public.nycmap_lot_transactions FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.nycmap_gift_codes (
  code text PRIMARY KEY,
  created_by_session_id text NOT NULL,
  created_by_buyer_token text NOT NULL DEFAULT '',
  created_by_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  redeemed_at timestamptz,
  redeemed_by_session_id text,
  redeemed_by_name text
);

CREATE INDEX IF NOT EXISTS nycmap_gift_codes_created_by_session_id_idx
  ON public.nycmap_gift_codes (created_by_session_id);

ALTER TABLE public.nycmap_gift_codes ENABLE ROW LEVEL SECURITY;
