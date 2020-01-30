CREATE TABLE IF NOT EXISTS content_votes (
  user_id INTEGER NOT NULL REFERENCES users(id),
  content_id VARCHAR NOT NULL,
  vote SMALLINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, content_id)
);

CREATE TRIGGER content_votes_updated_at
  BEFORE UPDATE ON content_votes
  FOR EACH ROW
  EXECUTE PROCEDURE updated_at();
