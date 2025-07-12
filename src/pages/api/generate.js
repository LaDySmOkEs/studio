// /src/pages/api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { summary } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal assistant helping users create legal documents such as Section 1983 complaints, motions, and demand letters.",
        },
        {
          role: "user",
          content: `Generate a legal document based on: ${summary}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const message = data?.choices?.[0]?.message?.content;

  res.status(200).json({ result: message });
}