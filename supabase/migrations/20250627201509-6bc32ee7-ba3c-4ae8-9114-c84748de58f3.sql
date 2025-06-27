
-- Fix the function search path security warnings by setting explicit search_path
-- This prevents potential security issues from search path manipulation

-- Update get_user_monthly_usage function
CREATE OR REPLACE FUNCTION public.get_user_monthly_usage(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month TEXT;
  usage_count INTEGER;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  SELECT emails_generated_this_month INTO usage_count
  FROM public.user_usage
  WHERE user_id = p_user_id AND month_year = current_month;
  
  RETURN COALESCE(usage_count, 0);
END;
$$;

-- Update increment_user_usage function
CREATE OR REPLACE FUNCTION public.increment_user_usage(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month TEXT;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  INSERT INTO public.user_usage (user_id, month_year, emails_generated_this_month)
  VALUES (p_user_id, current_month, 1)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    emails_generated_this_month = user_usage.emails_generated_this_month + 1,
    updated_at = NOW();
END;
$$;

-- Update setup_test_user function
CREATE OR REPLACE FUNCTION public.setup_test_user(p_email text, p_tier text)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;
