create or replace function public.broadcast_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_name text;
  user_image_url text;
begin
  -- Fetch author details from user_profile
  select name, image_url
  into user_name, user_image_url
  from public.user_profile
  where id = new.author_id;

  -- Send message to realtime
  perform realtime.send(
    'room:' || new.chat_room_id::text || ':messages',
    'message_created',
    jsonb_build_object(
      'id', new.id,
      'text', new.text,
      'created_at', new.created_at,
      'author_id', new.author_id,
      'author_name', user_name,
      'author_image_url', user_image_url
    ),
    true -- private: true, to respect RLS on realtime.messages if configured
  );

  return new;
end;
$$;

create trigger broadcast_message_trigger
after insert on public.message
for each row
execute function public.broadcast_message();
