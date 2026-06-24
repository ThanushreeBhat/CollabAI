export async function POST(req) {
  try {
    const { text } = await req.json();

    const prompt = `
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
`;

    let response;
    let data;

    // Retry 3 times if Gemini is busy
    for (let attempt = 1; attempt <= 3; attempt++) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      data = await response.json();

      console.log(`Attempt ${attempt}`);
      console.log("Status:", response.status);
      console.log("Gemini Response:", JSON.stringify(data));

      if (response.ok) {
        break;
      }

      // Wait 2 seconds before retrying
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!response.ok) {
      return Response.json(
        {
          error:
            data?.error?.message ||
            "Gemini is currently unavailable. Please try again later.",
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
        error: error.message || "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}