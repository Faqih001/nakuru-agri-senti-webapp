import React, { useEffect, useState } from 'react';
import { AlertCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Types for configuration issues
interface ConfigIssue {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'error' | 'info';
  link?: string;
  linkText?: string;
}

export const ConfigurationAlert = () => {
  const [configIssues, setConfigIssues] = useState<ConfigIssue[]>([]);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Check for configuration issues
    const issues: ConfigIssue[] = [];
    
    // Validate Supabase service role key
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey || serviceRoleKey === 'your_service_role_key_here') {
      issues.push({
        id: 'missing-service-role-key',
        title: 'Missing Service Role Key',
        description: 'The Supabase service role key is missing or invalid. User profile creation will fail.',
        severity: 'error',
        link: 'https://app.supabase.com',
        linkText: 'Get your key from Supabase Dashboard'
      });
    }
    
    // Only show issues in development mode
    if (import.meta.env.DEV) {
      setConfigIssues(issues);
    }
  }, []);
  
  const handleDismiss = (id: string) => {
    setDismissed(prev => ({ ...prev, [id]: true }));
    
    // Store in localStorage to prevent repeated alerts
    try {
      const dismissedIssues = JSON.parse(localStorage.getItem('dismissed_config_issues') || '{}');
      dismissedIssues[id] = true;
      localStorage.setItem('dismissed_config_issues', JSON.stringify(dismissedIssues));
    } catch (err) {
      console.error('Failed to save dismissed state:', err);
    }
    
    toast({
      title: 'Alert dismissed',
      description: 'You can find configuration instructions in the README.md file.',
    });
  };
  
  // Filter out dismissed alerts
  const activeIssues = configIssues.filter(issue => !dismissed[issue.id]);
  
  if (activeIssues.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
      {activeIssues.map(issue => (
        <Alert 
          key={issue.id} 
          variant={issue.severity === 'error' ? 'destructive' : 'default'}
          className="animate-slide-in-right"
        >
          <div className="flex justify-between">
            {issue.severity === 'error' ? <XCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
              onClick={() => handleDismiss(issue.id)}
            >
              ×
            </Button>
          </div>
          
          <AlertTitle>{issue.title}</AlertTitle>
          <AlertDescription>
            {issue.description}
            
            {issue.link && (
              <div className="mt-2">
                <a 
                  href={issue.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm underline"
                >
                  {issue.linkText || 'Learn more'}
                </a>
              </div>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default ConfigurationAlert;
