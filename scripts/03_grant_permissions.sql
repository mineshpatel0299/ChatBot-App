-- Grant permissions to the user role for chats table
GRANT SELECT, INSERT, UPDATE, DELETE ON chats TO "user";
GRANT USAGE ON SEQUENCE chats_id_seq TO "user";

-- Grant permissions to the user role for messages table
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO "user";
GRANT USAGE ON SEQUENCE messages_id_seq TO "user";

-- Grant permissions to execute the trigger function
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO "user";

-- Ensure users can access the auth schema for RLS policies
GRANT USAGE ON SCHEMA auth TO "user";
GRANT SELECT ON auth.users TO "user";
