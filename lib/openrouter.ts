const FREE_MODELS = [
  "google/gemma-4-31b-it:free",
  "deepseek/deepseek-v4-flash:free",
  "google/gemma-4-26b-a4b-it:free",
  "openrouter/owl-alpha",
  "poolside/laguna-m.1:free",
  "baidu/cobuddy:free",
  "poolside/laguna-xs.2:free",
];

export async function generateWithAI(prompt: string): Promise<string> {
  const model = FREE_MODELS[Math.floor(Math.random() * FREE_MODELS.length)];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://type-verse-rho.vercel.app",
      "X-Title": "TypeVerse",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content returned');
  return content.trim();
}
