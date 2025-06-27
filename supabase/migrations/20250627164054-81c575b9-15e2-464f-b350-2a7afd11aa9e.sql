
-- Add unique constraint on user_id to the subscribers table
-- This is needed for the ON CONFLICT clause in the setup_test_user function
ALTER TABLE public.subscribers 
ADD CONSTRAINT subscribers_user_id_unique UNIQUE (user_id);
