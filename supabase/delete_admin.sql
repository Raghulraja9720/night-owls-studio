-- =========================================================
-- Night Owls Studio: Delete Admin Account from Supabase
-- =========================================================
-- Run this in the Supabase SQL Editor to delete the admin user.
-- =========================================================

DELETE FROM auth.identities WHERE identity_data->>'email' = 'admin@nightowls.com';
DELETE FROM auth.users WHERE email = 'admin@nightowls.com';
