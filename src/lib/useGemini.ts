import axios from 'axios';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function fetchGeminiResponse(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY not found");

  const fullPrompt = `
You're an expert software engineer. Based on the following description, generate a project scaffold for a Discord bot.

Respond with Markdown using headings for filenames and code blocks for file content.

Discord Bot Idea:
${prompt}
`;

  const response = await axios.post(
    `${GEMINI_API_URL}?key=${apiKey}`,
    { contents: [{ parts: [{ text: fullPrompt }] }] },
    { headers: { 'Content-Type': 'application/json' } }
  );

  return (
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    'No response from Gemini'
  );
}
