-- Full purchase history. nycmap_lot_claims stays the current owner only.

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
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  kind text NOT NULL CHECK (kind IN ('claim', 'takeover', 'refunded_too_low')),
  previous_owner_name text,
  previous_price numeric(12,2),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS nycmap_lot_transactions_block_id_idx
  ON public.nycmap_lot_transactions (block_id, created_at DESC);

CREATE INDEX IF NOT EXISTS nycmap_lot_transactions_created_at_idx
  ON public.nycmap_lot_transactions (created_at DESC);

ALTER TABLE public.nycmap_lot_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "nycmap_lot_transactions_public_read" ON public.nycmap_lot_transactions;
CREATE POLICY "nycmap_lot_transactions_public_read"
  ON public.nycmap_lot_transactions
  FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO public.nycmap_lot_transactions (
  stripe_session_id,
  block_id,
  tax_block,
  neighborhood_id,
  neighborhood_name,
  owner_name,
  owner_url,
  owner_image,
  owner_color,
  amount,
  kind,
  created_at
)
SELECT
  stripe_session_id,
  block_id,
  tax_block,
  neighborhood_id,
  neighborhood_name,
  owner_name,
  owner_url,
  owner_image,
  owner_color,
  price,
  'claim',
  purchased_at
FROM public.nycmap_lot_claims
WHERE stripe_session_id IS NOT NULL
  AND stripe_session_id <> ''
ON CONFLICT (stripe_session_id) DO NOTHING;
