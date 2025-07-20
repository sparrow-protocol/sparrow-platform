CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  privy_id TEXT NOT NULL UNIQUE,
  email TEXT,
  wallet_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS privy_id_index ON users (privy_id);
CREATE UNIQUE INDEX IF NOT EXISTS wallet_address_index ON users (wallet_address);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  signature TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  amount TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  status TEXT NOT NULL,
  fee TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS signature_index ON transactions (signature);
