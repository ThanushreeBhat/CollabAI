export async function POST(req) {
  try {
    const { text } = await req.json();

    console.log("Planner route hit");
    console.log("API Key Exists:", !!process.env.GEMINI_API_KEY);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a daily planner assistant.

Create a simple numbered schedule for the tasks below.

Rules:
- Include time
- Include priority (High, Medium, Low)
- Plain text only
- No table
- No explanation

Tasks:
${text}
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini Status:", response.status);
    console.log("Gemini Response:", JSON.stringify(data));

    if (!response.ok) {
      return Response.json(
        {
          error: data,
        },
        {
          status: response.status,
        }
      );
    }

    const plan =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI could not generate a schedule.";

    return Response.json({
      result: plan,
    });
  } catch (error) {
    console.error("Planner API Error:", error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}