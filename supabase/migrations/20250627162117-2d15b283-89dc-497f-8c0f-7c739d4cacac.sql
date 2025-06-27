
-- Create the setup_test_user function to configure test user data
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
  -- Get the user ID from the profiles table using email
  SELECT id INTO user_record
  FROM public.profiles
  WHERE email = p_email;
  
  IF user_record.id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', p_email;
  END IF;
  
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
