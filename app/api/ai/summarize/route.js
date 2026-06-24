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
                  text: `Summarize this text in simple words:\n${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    return Response.json({ result: summary });

  } catch (error) {
    console.error(error);
    return Response.json({ result: "Gemini connection failed" });
  }
}