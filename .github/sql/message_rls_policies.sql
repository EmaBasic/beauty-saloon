-- ============================================================================
-- RLS Policies for message table
-- ============================================================================
-- These policies enable authenticated users to:
-- 1. Read messages from rooms they are members of
-- 2. Send messages to rooms they are members of
-- 3. Update their own messages
-- 4. Delete their own messages
-- ============================================================================

-- Enable RLS on message table
ALTER TABLE message ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SELECT policy: Users can read messages from rooms they're members of
-- ============================================================================
CREATE POLICY "Users can read messages from joined rooms"
ON message
FOR SELECT
TO authenticated
USING (
  chat_room_id IN (
    SELECT chat_room_id
    FROM chat_room_member
    WHERE member_id = auth.uid()
  )
);

-- ============================================================================
-- INSERT policy: Users can send messages to rooms they're members of
-- ============================================================================
CREATE POLICY "Users can send messages to joined rooms"
ON message
FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND chat_room_id IN (
    SELECT chat_room_id
    FROM chat_room_member
    WHERE member_id = auth.uid()
  )
);

-- ============================================================================
-- UPDATE policy: Users can update their own messages in joined rooms
-- ============================================================================
CREATE POLICY "Users can update own messages"
ON message
FOR UPDATE
TO authenticated
USING (
  author_id = auth.uid()
  AND chat_room_id IN (
    SELECT chat_room_id
    FROM chat_room_member
    WHERE member_id = auth.uid()
  )
)
WITH CHECK (
  author_id = auth.uid()
);

-- ============================================================================
-- DELETE policy: Users can delete their own messages
-- ============================================================================
CREATE POLICY "Users can delete own messages"
ON message
FOR DELETE
TO authenticated
USING (
  author_id = auth.uid()
);
