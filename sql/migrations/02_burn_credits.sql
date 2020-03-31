CREATE TABLE IF NOT EXISTS burn_credits (
  subreddit VARCHAR NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  balance BIGINT NOT NULL CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, subreddit)
);

CREATE TRIGGER burn_credits_updated_at
  BEFORE UPDATE ON burn_credits
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at();

CREATE OR REPLACE FUNCTION add_burn_credit(_subreddit VARCHAR, _user_id INTEGER, _amount INTEGER) RETURNS INT AS
$$
DECLARE
  balance_start INTEGER := (SELECT balance FROM burn_credits WHERE subreddit = _subreddit AND user_id = _user_id);
  balance_remaining INTEGER := COALESCE(balance_start, 0) + _amount;
BEGIN
  IF balance_start IS NULL THEN
    INSERT INTO burn_credits (subreddit, user_id, balance) VALUES (_subreddit, _user_id, balance_remaining);
  ELSE
    UPDATE burn_credits SET balance = balance_remaining WHERE subreddit = _subreddit AND user_id =_user_id;
  END IF;
  RETURN balance_remaining;
END;
$$ LANGUAGE PLPGSQL;
