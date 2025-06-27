
-- Create a table to store generated emails
CREATE TABLE public.generated_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subject_line TEXT,
  email_content TEXT NOT NULL,
  product_service TEXT,
  target_audience TEXT,
  tone TEXT,
  custom_hook TEXT,
  framework TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own emails
ALTER TABLE public.generated_emails ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own generated emails
CREATE POLICY "Users can view their own generated emails" 
  ON public.generated_emails 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own generated emails
CREATE POLICY "Users can create their own generated emails" 
  ON public.generated_emails 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own generated emails
CREATE POLICY "Users can delete their own generated emails" 
  ON public.generated_emails 
  FOR DELETE 
  USING (auth.uid() = user_id);
