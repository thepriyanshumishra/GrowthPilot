import { groq } from "./groq-client";

export async function analyzeSkillGap(profile: {
    skills: string[]
    targetRole: string
}) {
    const prompt = `
    Analyze the skill gap between the user's current skills and their target role.
    
    Current Skills: ${profile.skills.join(", ")}
    Target Role: ${profile.targetRole}

    Return a JSON object with this exact schema:
    {
      "missingSkills": [
        { "name": "Skill Name", "priority": "High | Medium | Low", "reason": "Why it is needed" }
      ],
      "matchPercentage": 75
    }
  `;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: "You are a skill analysis agent that outputs only valid JSON." },
            { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
}
