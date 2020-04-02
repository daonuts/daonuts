CREATE TABLE IF NOT EXISTS content_stakes (
  content_id VARCHAR PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION content_stake(_subreddit VARCHAR, _price INTEGER, _user_id INTEGER, _content_id VARCHAR) RETURNS INT AS
$$
DECLARE
  _address VARCHAR := (SELECT address FROM users WHERE id = _user_id);
  _staker INTEGER := (SELECT user_id FROM content_stakes WHERE content_id = _content_id);
  _balance_start INTEGER := (SELECT balance FROM burn_credits WHERE subreddit = _subreddit AND address = _address);
  _balance_remaining INTEGER := _balance_start - _price;
BEGIN
  IF _staker IS NOT NULL THEN
    RAISE USING ERRCODE = '23505', MESSAGE = 'Already staked';
  ELIF _balance_start IS NULL OR _balance_remaining < 0 THEN
    RAISE USING ERRCODE = '22003', MESSAGE = 'Insufficient balance';
  END IF;
  UPDATE burn_credits SET balance = _balance_remaining WHERE subreddit = _subreddit AND address = _address;
  INSERT INTO content_stakes (user_id, content_id) VALUES (_user_id, _content_id);
  RETURN _balance_remaining;
END;
$$ LANGUAGE PLPGSQL;
