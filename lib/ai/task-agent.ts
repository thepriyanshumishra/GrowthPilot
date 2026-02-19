import { groq } from "./groq-client";

export async function generateDailyTasks(context: {
    roadmapTitle: string
    currentMilestone: string
    availabilityHours: number
}) {
    const prompt = `
    You are a Daily Productivity Coach. Given the user's roadmap and current milestone, generate exactly 3 daily tasks for today.
    
    Roadmap: ${context.roadmapTitle}
    Current Milestone: ${context.currentMilestone}
    Available Time: ${context.availabilityHours} hours

    Return a JSON object with this exact schema:
    {
      "tasks": [
        {
          "title": "Task Title",
          "description": "Specific actionable steps",
          "difficulty": "Easy | Medium | Hard",
          "estimatedMinutes": 30
        }
      ]
    }
  `;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: "You are a productivity agent that outputs only valid JSON." },
            { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
}
