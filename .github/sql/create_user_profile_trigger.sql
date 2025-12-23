-- Create a function to handle new user insertion
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_name text;
begin
  -- Try to get name from metadata
  user_name := new.raw_user_meta_data->>'full_name';
  if user_name is null then
    user_name := new.raw_user_meta_data->>'name';
  end if;
  if user_name is null then
     -- Fallback to email user part or default
     user_name := coalesce(split_part(new.email, '@', 1), 'New User');
  end if;

  insert into public.user_profile (id, name, image_url)
  values (
    new.id,
    user_name,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Create the trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
