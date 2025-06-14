-- Complete User Role Normalization
-- This script finishes the user role normalization by:
-- 1. Dropping the old 'role' TEXT column from users table
-- 2. Ensuring foreign key constraint is properly set up for role_id

-- First, check current state
\echo 'Current users table structure:'
\d users

\echo 'Current enum_roles values:'
SELECT * FROM enum_roles ORDER BY id;

-- Drop the old role column
\echo 'Dropping old role TEXT column...'
ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Ensure foreign key constraint exists for role_id
\echo 'Adding foreign key constraint for role_id...'
ALTER TABLE users 
  ADD CONSTRAINT fk_users_role_id 
  FOREIGN KEY (role_id) 
  REFERENCES enum_roles(id);

-- Verify the changes
\echo 'Updated users table structure:'
\d users

\echo 'Verifying foreign key constraints:'
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'users'
  AND kcu.column_name = 'role_id';

\echo 'User Role Normalization completed successfully!'
