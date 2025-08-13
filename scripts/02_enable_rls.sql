-- Enable Row Level Security on chats table
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own chats" ON chats;
DROP POLICY IF EXISTS "Users can insert their own chats" ON chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON chats;
DROP POLICY IF EXISTS "Users can delete their own chats" ON chats;

DROP POLICY IF EXISTS "Users can view messages from their chats" ON messages;
DROP POLICY IF EXISTS "Users can insert messages to their chats" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

-- Updated to use Nhost/Hasura session variables instead of auth.uid()
-- Create RLS policies for chats table
CREATE POLICY "Users can view their own chats" ON chats
    FOR SELECT USING (current_setting('hasura.user-id', true)::uuid = user_id);

CREATE POLICY "Users can insert their own chats" ON chats
    FOR INSERT WITH CHECK (current_setting('hasura.user-id', true)::uuid = user_id);

CREATE POLICY "Users can update their own chats" ON chats
    FOR UPDATE USING (current_setting('hasura.user-id', true)::uuid = user_id);

CREATE POLICY "Users can delete their own chats" ON chats
    FOR DELETE USING (current_setting('hasura.user-id', true)::uuid = user_id);

-- Create RLS policies for messages table
CREATE POLICY "Users can view messages from their chats" ON messages
    FOR SELECT USING (
        current_setting('hasura.user-id', true)::uuid = user_id OR 
        EXISTS (
            SELECT 1 FROM chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = current_setting('hasura.user-id', true)::uuid
        )
    );

CREATE POLICY "Users can insert messages to their chats" ON messages
    FOR INSERT WITH CHECK (
        current_setting('hasura.user-id', true)::uuid = user_id AND
        EXISTS (
            SELECT 1 FROM chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = current_setting('hasura.user-id', true)::uuid
        )
    );

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (
        current_setting('hasura.user-id', true)::uuid = user_id AND
        EXISTS (
            SELECT 1 FROM chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = current_setting('hasura.user-id', true)::uuid
        )
    );

CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (
        current_setting('hasura.user-id', true)::uuid = user_id AND
        EXISTS (
            SELECT 1 FROM chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = current_setting('hasura.user-id', true)::uuid
        )
    );
