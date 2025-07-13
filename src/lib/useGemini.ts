import axios from 'axios';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function fetchGeminiResponse(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY not found");

  const fullPrompt = `
You're an expert software engineer.

Create a fully functional Discord bot project using the best-suited language for the task (either Python or JavaScript).

Requirements:
- Implement at least one real feature (e.g., welcome message, moderation, custom commands)
- Use best practices and working code
- Include only these 4 files:
  - bot.{py|js} → main bot logic
  - config.json → configuration file 
  - .env → environment variables
  - README.md → instructions

🧾 Output Format:
1. Each file should start with a Markdown heading: ## filename (e.g., ## bot.py or ## bot.js)
2. Follow each heading with a triple backtick code block and the file content.
3. Do not include any text outside the file headers and code blocks.
4. All code must be runnable and complete — no placeholders or explanations.

Your response must be clean and ready to parse into actual files for ZIP download.

Begin now.
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
