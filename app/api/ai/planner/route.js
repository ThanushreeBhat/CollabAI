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
              parts: [
                {
                  text: `
You are a daily planner assistant.

Create a simple numbered schedule for the tasks below.

Rules:
- include time
- include priority (High, Medium, Low)
- plain text only
- no table
- no explanation

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

    console.log("Planner Gemini:", data);

    let plan = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!plan) {
      plan = "AI could not generate schedule.";
    }

    return Response.json({ result: plan });

  } catch (error) {
    console.error("Planner API error:", error);
    return Response.json({ result: "Planner failed" });
  }
}