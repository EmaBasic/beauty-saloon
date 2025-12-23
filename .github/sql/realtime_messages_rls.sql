-- Enable RLS on realtime.messages table if not already enabled
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Helper function to extract room ID from channel topic
-- Channel format: "room:${roomId}:messages"
CREATE OR REPLACE FUNCTION realtime.extract_room_id(topic text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
SECURITY INVOKER
AS $$
  SELECT (substring(topic from 'room:([^:]+):messages'))::uuid;
$$;

-- SELECT policy: Users can read presence updates and message broadcasts from rooms they are members of
CREATE POLICY "Users can read messages from joined rooms" 
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.extract_room_id(topic) IN (
    SELECT chat_room_id
    FROM chat_room_member
    WHERE member_id = (SELECT auth.uid())
  )
);

-- INSERT policy: Users can insert presence updates and broadcasts to rooms they are members of
CREATE POLICY "Users can send messages to joined rooms"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  realtime.extract_room_id(topic) IN (
    SELECT chat_room_id
    FROM chat_room_member
    WHERE member_id = (SELECT auth.uid())
  )
);

-- UPDATE policy: Users can update messages in rooms they are members of
CREATE POLICY "Users can update messages in joined rooms"
ON realtime.messages
FOR UPDATE
TO authenticated
USING (
  realtime.extract_room_id(topic) IN (
    SELECT chat_room_id
    FROM chat_room_member
    WHERE member_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  realtime.extract_room_id(topic) IN (
    SELECT chat_room_id
    FROM chat_room_member
    WHERE member_id = (SELECT auth.uid())
  )
);

-- DELETE policy: Users can delete messages in rooms they are members of
CREATE POLICY "Users can delete messages in joined rooms"
ON realtime.messages
FOR DELETE
TO authenticated
USING (
  realtime.extract_room_id(topic) IN (
    SELECT chat_room_id
    FROM chat_room_member
    WHERE member_id = (SELECT auth.uid())
  )
);

-- Create index on chat_room_member.member_id for performance
CREATE INDEX IF NOT EXISTS idx_chat_room_member_member_id 
ON chat_room_member USING btree (member_id);

-- Create index on chat_room_member.chat_room_id for performance
CREATE INDEX IF NOT EXISTS idx_chat_room_member_chat_room_id 
ON chat_room_member USING btree (chat_room_id);
