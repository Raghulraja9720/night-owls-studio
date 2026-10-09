-- =========================================================
-- Night Owls Studio: Reset & Create Admin Account via SQL
-- =========================================================
-- Deletes any previous/default admin user with this email
-- and creates a fresh verified admin account.
-- 
-- Email:    admin@nightowls.com
-- Password: AdminPassword123!
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  admin_email text := 'admin@nightowls.com';
  admin_password text := 'AdminPassword123!';
BEGIN
  -- 1. Delete old/default user if exists (ensures clean reset)
  DELETE FROM auth.identities WHERE identity_data->>'email' = admin_email;
  DELETE FROM auth.users WHERE email = admin_email;

  -- 2. Create fresh admin in auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Night Owls Admin"}'::jsonb,
    now(),
    now(),
    ''
  );

  -- 3. Create identity in auth.identities
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', admin_email),
    'email',
    admin_email,
    now(),
    now(),
    now()
  );

  RAISE NOTICE 'Admin user created successfully: %', admin_email;
END $$;
