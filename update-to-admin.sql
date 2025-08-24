-- SQL script to update user to admin
-- Run this in your MySQL database

-- Update the user to admin and verify email
UPDATE users 
SET user_type = 'admin', code = 0 
WHERE email = 'admin@roseheavenlysalon.com';

-- Verify the update
SELECT id, username, email, user_type, code FROM users WHERE email = 'admin@roseheavenlysalon.com';

