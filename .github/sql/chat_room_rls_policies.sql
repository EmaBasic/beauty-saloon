-- ============================================================================
-- RLS Policies for chat_room and chat_room_member tables
-- ============================================================================
-- These policies enable authenticated users to:
-- 1. Read all public chat rooms
-- 2. Read their own membership rows
-- 3. Join public chat rooms (insert themselves)
-- 4. Remove themselves from rooms (delete their own membership)
-- ============================================================================

-- Enable RLS on tables
ALTER TABLE chat_room ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_member ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- chat_room policies
-- ============================================================================

CREATE POLICY "Users can read public chat rooms"
ON chat_room
FOR SELECT
TO authenticated
USING ( is_public = true );

-- ============================================================================
-- chat_room_member policies
-- ============================================================================

CREATE POLICY "Users can read own membership rows"
ON chat_room_member
FOR SELECT
TO authenticated
USING ( (select auth.uid()) = member_id );

CREATE POLICY "Users can join public chat rooms"
ON chat_room_member
FOR INSERT
TO authenticated
WITH CHECK (
  (select auth.uid()) = member_id
  AND chat_room_id IN (
    SELECT id FROM chat_room WHERE is_public = true
  )
);

CREATE POLICY "Users can remove themselves from rooms"
ON chat_room_member
FOR DELETE
TO authenticated
USING ( (select auth.uid()) = member_id );
