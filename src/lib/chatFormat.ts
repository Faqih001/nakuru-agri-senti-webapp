/**
 * Utility functions for formatting chatbot responses with proper structure
 */

export interface FormattedResponse {
  content: string;
  formatted: boolean;
}

/**
 * Formats a chatbot response with proper headings, bullets, numbers, and spacing
 */
export function formatChatbotResponse(text: string): FormattedResponse {
  if (!text || typeof text !== 'string') {
    return { content: text, formatted: false };
  }

  let formatted = text;
  let hasFormatting = false;

  // 1. Format numbered lists (1., 2., 3., etc.)
  formatted = formatted.replace(/^(\d+)\.\s*/gm, (match, num) => {
    hasFormatting = true;
    return `${num}. `;
  });

  // 2. Format bullet points (-, *, •)
  formatted = formatted.replace(/^[\-\*•]\s*/gm, () => {
    hasFormatting = true;
    return '• ';
  });

  // 3. Format headings (words followed by colon and newline or end of string)
  formatted = formatted.replace(/^([A-Z][A-Za-z\s]+):\s*$/gm, (match, heading) => {
    hasFormatting = true;
    return `**${heading.trim()}:**\n`;
  });

  // 4. Format inline headings (words followed by colon in middle of text)
  formatted = formatted.replace(/\b([A-Z][A-Za-z\s]{2,20}):\s*([^\n])/g, (match, heading, nextChar) => {
    hasFormatting = true;
    return `**${heading.trim()}:** ${nextChar}`;
  });

  // 5. Format recommendations, tips, steps sections
  formatted = formatted.replace(/\b(Recommendations?|Tips?|Steps?|Guidelines?|Instructions?|Benefits?|Advantages?|Disadvantages?|Precautions?|Warning):\s*\n?/gi, (match, word) => {
    hasFormatting = true;
    return `\n**${word}:**\n`;
  });

  // 6. Add proper spacing around sections
  formatted = formatted.replace(/\*\*([^*]+)\*\*:\s*\n/g, '\n**$1:**\n');

  // 7. Ensure bullet points are properly spaced
  formatted = formatted.replace(/•\s*([^\n]+)/g, '• $1');

  // 8. Clean up multiple newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // 9. Trim leading/trailing whitespace
  formatted = formatted.trim();

  // 10. Add spacing after numbered items
  formatted = formatted.replace(/(\d+\.\s[^\n]+)(\n)(\d+\.)/g, '$1\n\n$3');

  // 11. Add spacing after bullet items when followed by headings
  formatted = formatted.replace(/(•\s[^\n]+)(\n)(\*\*[^*]+\*\*:)/g, '$1\n\n$3');

  return {
    content: formatted,
    formatted: hasFormatting
  };
}

/**
 * Converts formatted text to HTML for better rendering
 */
export function formatToHTML(text: string): string {
  let html = text;
  
  // Convert markdown-style bold to HTML
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Convert bullet points to HTML list items
  const lines = html.split('\n');
  let inList = false;
  const htmlLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('• ')) {
      if (!inList) {
        htmlLines.push('<ul class="list-disc list-inside space-y-1 ml-4">');
        inList = true;
      }
      htmlLines.push(`<li>${line.substring(2)}</li>`);
    } else if (line.match(/^\d+\.\s/)) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      if (i === 0 || !lines[i-1].trim().match(/^\d+\.\s/)) {
        htmlLines.push('<ol class="list-decimal list-inside space-y-1 ml-4">');
      }
      htmlLines.push(`<li>${line.replace(/^\d+\.\s/, '')}</li>`);
      
      // Check if next line is not a numbered item
      if (i === lines.length - 1 || !lines[i+1].trim().match(/^\d+\.\s/)) {
        htmlLines.push('</ol>');
      }
    } else {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      if (line) {
        htmlLines.push(`<p>${line}</p>`);
      } else {
        htmlLines.push('<br>');
      }
    }
  }
  
  if (inList) {
    htmlLines.push('</ul>');
  }
  
  return htmlLines.join('\n');
}

/**
 * Creates a better prompt for structured responses
 */
export function createStructuredPrompt(userInput: string, isMobile: boolean = false): string {
  const mobileInstruction = isMobile ? 
    "IMPORTANT: User is on mobile - keep response concise (150-200 words max). " : "";
  
  return `You are an AI assistant for AgriSenti, specializing in agricultural topics for Nakuru County, Kenya.

${mobileInstruction}Format your response with clear structure:
- Use headings followed by colons (e.g., "Fertilizer Recommendations:")
- Use bullet points (•) for lists
- Use numbered lists for sequential steps
- Add spacing between sections
- Be practical and specific to Nakuru's agricultural context

Focus on: farming advice, weather insights, crop information, pest management, and market data.
Current date: ${new Date().toLocaleDateString()}

User query: ${userInput}`;
}
