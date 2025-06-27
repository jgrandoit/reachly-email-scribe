import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2, Mail, Calendar, Sparkles, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GeneratedEmail {
  id: string;
  subject_line: string | null;
  email_content: string;
  product_service: string | null;
  target_audience: string | null;
  tone: string | null;
  framework: string | null;
  created_at: string;
}

interface EmailHistoryProps {
  onEditEmail?: (email: GeneratedEmail) => void;
}

export const EmailHistory = ({ onEditEmail }: EmailHistoryProps) => {
  const [emails, setEmails] = useState<GeneratedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEmails = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('generated_emails')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast({
        title: "Error",
        description: "Failed to load your email history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [user]);

  const copyToClipboard = (content: string, subject?: string) => {
    const emailText = subject ? `Subject: ${subject}\n\n${content}` : content;
    navigator.clipboard.writeText(emailText);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard.",
    });
  };

  const continueEditing = (email: GeneratedEmail) => {
    try {
      // Save the email data to localStorage for the generator to pick up
      const formData = {
        productService: email.product_service || "",
        targetAudience: email.target_audience || "",
        selectedIndustry: "",
        selectedTone: email.tone || "professional",
        customHook: ""
      };
      
      // Save form data
      localStorage.setItem('email-generator-form-data', JSON.stringify(formData));
      
      // Save the email content as generated emails
      localStorage.setItem('email-generator-emails', JSON.stringify({
        emailA: email.email_content,
        emailB: "", // Only one email from history
        timestamp: Date.now()
      }));
      
      // Use the callback prop to navigate to generator if provided
      if (onEditEmail) {
        onEditEmail(email);
      } else {
        // Fallback: reload to trigger the restoration
        window.location.reload();
      }
      
      toast({
        title: "Loading Email for Editing",
        description: "Email loaded into generator for editing...",
      });
    } catch (error) {
      console.error('Error loading email for editing:', error);
      toast({
        title: "Error",
        description: "Failed to load email for editing.",
        variant: "destructive",
      });
    }
  };

  const deleteEmail = async (emailId: string) => {
    setDeleting(emailId);
    
    try {
      const { error } = await supabase
        .from('generated_emails')
        .delete()
        .eq('id', emailId);

      if (error) throw error;

      setEmails(emails.filter(email => email.id !== emailId));
      toast({
        title: "Deleted",
        description: "Email removed from your history.",
      });
    } catch (error) {
      console.error('Error deleting email:', error);
      toast({
        title: "Error",
        description: "Failed to delete email.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="text-gray-600 mt-2">Loading your emails...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (emails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
              <Mail className="w-8 h-8 text-blue-300" />
              <Sparkles className="w-4 h-4 text-blue-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No emails yet?</h3>
            <p className="text-gray-600 mb-4">Hit 'Create Email' to get started!</p>
            <div className="text-sm text-gray-500">
              Your generated emails will appear here for easy access and reuse.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email History
          <Badge variant="secondary">{emails.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {emails.map((email) => (
            <div
              key={email.id}
              className="border rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {email.subject_line || 'No Subject'}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(email.created_at)}
                    {email.tone && (
                      <Badge variant="outline" className="text-xs">
                        {email.tone}
                      </Badge>
                    )}
                    {email.framework && (
                      <Badge variant="outline" className="text-xs">
                        {email.framework}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => continueEditing(email)}
                    title="Continue editing in generator"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(email.email_content, email.subject_line || undefined)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteEmail(email.id)}
                    disabled={deleting === email.id}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {email.target_audience && (
                <p className="text-xs text-gray-600 mb-2">
                  Target: {email.target_audience}
                </p>
              )}
              
              <div className="bg-white p-3 rounded border text-sm font-mono whitespace-pre-wrap text-gray-700 max-h-32 overflow-y-auto">
                {email.email_content.length > 200 
                  ? `${email.email_content.substring(0, 200)}...`
                  : email.email_content
                }
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
