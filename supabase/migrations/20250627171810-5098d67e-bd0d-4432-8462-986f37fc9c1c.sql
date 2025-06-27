
-- Update the setup_test_user function to work with auth.users table directly
CREATE OR REPLACE FUNCTION public.setup_test_user(
  p_email TEXT,
  p_tier TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Get the user ID from the auth.users table using email
  SELECT id INTO user_record
  FROM auth.users
  WHERE email = p_email;
  
  IF user_record.id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found in auth.users', p_email;
  END IF;
  
  -- Ensure the user has a profile record (create if missing)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    user_record.id,
    p_email,
    CASE 
      WHEN p_tier = 'free' THEN 'Free User'
      WHEN p_tier = 'starter' THEN 'Starter User'
      WHEN p_tier = 'pro' THEN 'Pro User'
      ELSE 'Test User'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  -- Insert or update subscriber record
  INSERT INTO public.subscribers (
    user_id,
    email,
    subscribed,
    subscription_tier,
    subscription_end,
    created_at,
    updated_at
  )
  VALUES (
    user_record.id,
    p_email,
    CASE WHEN p_tier = 'free' THEN false ELSE true END,
    CASE WHEN p_tier = 'free' THEN NULL ELSE p_tier END,
    CASE WHEN p_tier = 'free' THEN NULL ELSE (NOW() + INTERVAL '1 year') END,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    subscribed = CASE WHEN p_tier = 'free' THEN false ELSE true END,
    subscription_tier = CASE WHEN p_tier = 'free' THEN NULL ELSE p_tier END,
    subscription_end = CASE WHEN p_tier = 'free' THEN NULL ELSE (NOW() + INTERVAL '1 year') END,
    updated_at = NOW();
    
  -- Initialize usage data for the current month
  INSERT INTO public.user_usage (
    user_id,
    month_year,
    emails_generated_this_month
  )
  VALUES (
    user_record.id,
    TO_CHAR(NOW(), 'YYYY-MM'),
    0
  )
  ON CONFLICT (user_id, month_year)
  DO NOTHING;
  
END;
$$;
