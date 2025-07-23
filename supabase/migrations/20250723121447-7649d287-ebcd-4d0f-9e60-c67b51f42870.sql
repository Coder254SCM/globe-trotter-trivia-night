-- Add missing database functions for multiplayer functionality

-- Function to increment session players
CREATE OR REPLACE FUNCTION increment_session_players(session_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE multiplayer_sessions 
  SET current_players = current_players + 1 
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement session players
CREATE OR REPLACE FUNCTION decrement_session_players(session_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE multiplayer_sessions 
  SET current_players = current_players - 1 
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql;