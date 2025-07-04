import React from 'react';
import { formatChatbotResponse, formatToHTML } from '@/lib/chatFormat';

interface FormattedMessageProps {
  content: string;
  className?: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ 
  content, 
  className = "" 
}) => {
  const { content: formattedContent, formatted } = formatChatbotResponse(content);
  
  // If the message has formatting, render it with proper structure
  if (formatted) {
    return (
      <div 
        className={`formatted-message ${className}`}
        dangerouslySetInnerHTML={{ 
          __html: formatToHTML(formattedContent)
        }} 
        style={{
          lineHeight: '1.6',
        }}
      />
    );
  }
  
  // Fallback to simple paragraph for unformatted content
  return (
    <p className={`whitespace-pre-wrap ${className}`}>
      {formattedContent}
    </p>
  );
};

export default FormattedMessage;
