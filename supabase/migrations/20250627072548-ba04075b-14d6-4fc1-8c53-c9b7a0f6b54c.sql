
-- Create a table to track user usage and quotas
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emails_generated_this_month INTEGER NOT NULL DEFAULT 0,
  month_year TEXT NOT NULL, -- Format: "2024-01"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Enable Row Level Security
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own usage
CREATE POLICY "Users can view their own usage" 
ON public.user_usage 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to update their own usage
CREATE POLICY "Users can update their own usage" 
ON public.user_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own usage
CREATE POLICY "Users can insert their own usage" 
ON public.user_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for edge functions to manage usage (using service role)
CREATE POLICY "Service role can manage all usage" 
ON public.user_usage 
FOR ALL 
USING (true);

-- Create an index for efficient queries
CREATE INDEX idx_user_usage_user_month ON public.user_usage(user_id, month_year);

-- Function to get current month usage for a user
CREATE OR REPLACE FUNCTION public.get_user_monthly_usage(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to increment user usage
CREATE OR REPLACE FUNCTION public.increment_user_usage(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
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
