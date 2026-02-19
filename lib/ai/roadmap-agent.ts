import { groq } from "./groq-client";

interface UserProfile {
  currentRole: string;
  targetRole: string;
  experienceLevel: string;
  skills: string[];
  availability: number;
}

export async function generateRoadmap(profile: UserProfile) {
  const prompt = `
    You are a Strategic Career Architect. 
    Design a personalized career roadmap to help a user transition from their current state to their target goal.
    
    User Profile:
    - Current Role: ${profile.currentRole}
    - Target Goal/Role: ${profile.targetRole}
    - Experience Level: ${profile.experienceLevel}
    - Current Skills: ${profile.skills.join(", ")}
    - Studying Availability: ${profile.availability} hours per day
    
    The roadmap should be practical, time-bound, and broken down into 4-6 major milestones.
    Each milestone should have a clear title and a detailed description of what needs to be achieved.
    
    Return a JSON object with this exact schema:
    {
      "title": "Roadmap Title",
      "description": "Short overview of the strategy",
      "milestones": [
        {
          "title": "Milestone Name",
          "description": "Deep dive into what to learn, build, or achieve in this phase."
        }
      ]
    }
    `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a career growth expert. You output ONLY valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("AI failed to generate roadmap");

  return JSON.parse(content);
}
