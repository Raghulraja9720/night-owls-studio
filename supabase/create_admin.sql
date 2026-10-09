-- =========================================================
-- Night Owls Studio: Create Admin Account via SQL
-- =========================================================
-- You can run this in the Supabase SQL Editor if you prefer
-- creating the admin user via SQL instead of the Dashboard.
-- 
-- Default credentials:
-- Email:    admin@nightowls.com
-- Password: AdminPassword123!
-- (You can change these values below before running!)
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  admin_email text := 'admin@nightowls.com';       -- <-- CHANGE EMAIL HERE IF DESIRED
  admin_password text := 'AdminPassword123!';     -- <-- CHANGE PASSWORD HERE IF DESIRED
BEGIN
  -- 1. Create user in auth.users if they don't already exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
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

    -- 2. Create corresponding identity in auth.identities
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

    RAISE NOTICE 'Admin user created successfully with email: %', admin_email;
  ELSE
    RAISE NOTICE 'Admin user with email % already exists.', admin_email;
  END IF;
END $$;
