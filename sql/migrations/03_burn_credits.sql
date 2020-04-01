CREATE TABLE IF NOT EXISTS burn_credits (
  subreddit VARCHAR NOT NULL,
  address VARCHAR NOT NULL REFERENCES users(address),
  balance BIGINT NOT NULL CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (subreddit, address)
);

ALTER TABLE burn_credits ADD CONSTRAINT burn_credits_subreddit_lowercase_ck CHECK (subreddit = lower(subreddit));
ALTER TABLE burn_credits ADD CONSTRAINT burn_credits_address_lowercase_ck CHECK (address = lower(address));

CREATE TRIGGER burn_credits_updated_at
  BEFORE UPDATE ON burn_credits
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at();

CREATE OR REPLACE FUNCTION add_burn_credit(_subreddit VARCHAR, _address VARCHAR, _amount INTEGER, _tx_hash VARCHAR) RETURNS INT AS
$$
DECLARE
  balance_start INTEGER := (SELECT balance FROM burn_credits WHERE subreddit = _subreddit AND address = _address);
  balance_remaining INTEGER := COALESCE(balance_start, 0) + _amount;
BEGIN
  INSERT INTO eth_tx (hash) VALUES (_tx_hash);
  IF balance_start IS NULL THEN
    INSERT INTO burn_credits (subreddit, address, balance) VALUES (_subreddit, _address, balance_remaining);
  ELSE
    UPDATE burn_credits SET balance = balance_remaining WHERE subreddit = _subreddit AND address =_address;
  END IF;
  RETURN balance_remaining;
END;
$$ LANGUAGE PLPGSQL;
