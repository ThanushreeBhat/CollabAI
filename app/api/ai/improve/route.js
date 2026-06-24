export async function POST(req) {
  try {
    const { text } = await req.json();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Improve the clarity and professionalism of this text:\n${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const improved =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    return Response.json({ result: improved });

  } catch (error) {
    return Response.json({ result: "AI improve failed" });
  }
}