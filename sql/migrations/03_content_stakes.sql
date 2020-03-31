CREATE TABLE IF NOT EXISTS content_stakes (
  content_id VARCHAR PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION content_stake(_subreddit VARCHAR, _price INTEGER, _user_id INTEGER, _content_id VARCHAR) RETURNS INT AS
$$
DECLARE
  balance_start INTEGER := (SELECT balance FROM burn_credits WHERE subreddit = _subreddit AND user_id = _user_id);
  balance_remaining INTEGER := balance_start - _price;
BEGIN
  IF balance_start IS NULL OR balance_remaining < 0 THEN
    RAISE USING ERRCODE = '22003', MESSAGE = 'Insufficient balance';
  END IF;
  UPDATE burn_credits SET balance = balance_remaining WHERE subreddit = _subreddit AND user_id =_user_id;
  INSERT INTO content_stakes (user_id, content_id) VALUES (_user_id, _content_id);
  RETURN balance_remaining;
END;
$$ LANGUAGE PLPGSQL;
