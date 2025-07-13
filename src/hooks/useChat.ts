import { useState } from 'react';
import { fetchGeminiResponse } from '@/lib/useGemini';

export interface Message {
  content: string;
  role: 'user' | 'assistant';
}

export const useChat = (p0: { initialMessages: Message[] }) => {

  const [messages, setMessages] = useState<Message[]>(p0.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState<string>('');
  const [botData, setBotData] = useState<{
    name: string;
    description: string;
    features: { name: string; description: string }[];
  } | null>(null);

  const extractBotData = (content: string) => {
    try {
      const featureRegex = /- ([^:]+): ([^\n]+)/g;
      const features = [];
      let match;
      while ((match = featureRegex.exec(content)) !== null) {
        features.push({ name: match[1].trim(), description: match[2].trim() });
      }

      const nameMatch = content.match(/bot called "([^"]+)"/i);
      const name = nameMatch ? nameMatch[1] : 'DiscordAssistant';

      const descMatch = content.match(/Discord bot that ([^\.]+)/i);
      const description = descMatch
        ? `A Discord bot that ${descMatch[1]}`
        : 'A custom Discord bot';

      return {
        name,
        description,
        features: features.length > 0
          ? features
          : [{ name: 'Custom Commands', description: 'Create custom responses to specific commands.' }],
      };
    } catch {
      return {
        name: 'DiscordAssistant',
        description: 'A custom Discord bot',
        features: [{ name: 'Custom Commands', description: 'Create custom responses to specific commands.' }],
      };
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage = { role: 'user' as const, content };
    setMessages(prev => [...prev, userMessage]);

    try {
      setIsLoading(true);
      const responseText = await fetchGeminiResponse(content);
      setGeminiResponse(responseText);

      const assistantMessage = { role: 'assistant' as const, content: responseText };
      setMessages(prev => [...prev, assistantMessage]);

      setBotData(extractBotData(responseText));
    } catch (error) {
      console.error('Gemini API error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    geminiResponse,
    messages,
    isLoading,
    sendMessage,
    botData,
  };
};
