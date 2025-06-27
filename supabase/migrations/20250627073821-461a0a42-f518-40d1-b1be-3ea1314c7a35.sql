
-- Create a table to store email ratings for training data
CREATE TABLE public.email_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email_content TEXT NOT NULL,
  framework TEXT NOT NULL,
  tone TEXT NOT NULL,
  product_service TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  custom_hook TEXT,
  rating TEXT NOT NULL CHECK (rating IN ('useful', 'needs_work')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.email_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for email ratings
CREATE POLICY "Users can view their own ratings" 
  ON public.email_ratings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ratings" 
  ON public.email_ratings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create an index for better performance on user queries
CREATE INDEX idx_email_ratings_user_id ON public.email_ratings(user_id);
CREATE INDEX idx_email_ratings_created_at ON public.email_ratings(created_at);
