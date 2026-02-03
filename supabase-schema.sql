-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'qris')),
  customer_name TEXT,
  table_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transaction_items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id SERIAL PRIMARY KEY,
  transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anon key)
-- Products policies
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert access for all users" ON products;
CREATE POLICY "Enable insert access for all users" ON products
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for all users" ON products;
CREATE POLICY "Enable update access for all users" ON products
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete access for all users" ON products;
CREATE POLICY "Enable delete access for all users" ON products
  FOR DELETE USING (true);

-- Transactions policies
DROP POLICY IF EXISTS "Enable read access for all users" ON transactions;
CREATE POLICY "Enable read access for all users" ON transactions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert access for all users" ON transactions;
CREATE POLICY "Enable insert access for all users" ON transactions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for all users" ON transactions;
CREATE POLICY "Enable update access for all users" ON transactions
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete access for all users" ON transactions;
CREATE POLICY "Enable delete access for all users" ON transactions
  FOR DELETE USING (true);

-- Transaction items policies
DROP POLICY IF EXISTS "Enable read access for all users" ON transaction_items;
CREATE POLICY "Enable read access for all users" ON transaction_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert access for all users" ON transaction_items;
CREATE POLICY "Enable insert access for all users" ON transaction_items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update access for all users" ON transaction_items;
CREATE POLICY "Enable update access for all users" ON transaction_items
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete access for all users" ON transaction_items;
CREATE POLICY "Enable delete access for all users" ON transaction_items
  FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
