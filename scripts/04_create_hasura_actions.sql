-- Create custom types for the sendMessage action
CREATE TYPE send_message_input AS (
    chat_id UUID,
    message TEXT
);

CREATE TYPE send_message_output AS (
    success BOOLEAN,
    message TEXT,
    response_id UUID
);

-- Note: The actual Hasura Action will be configured through the Hasura Console
-- This file documents the expected structure for reference
