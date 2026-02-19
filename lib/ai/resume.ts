import Groq from "groq-sdk";
import * as pdf from "pdf-parse";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

interface PDFData {
    text: string;
    numpages: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
    version: string;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        const data = await (pdf as unknown as (b: Buffer) => Promise<PDFData>)(buffer);
        return data.text;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to parse resume PDF.");
    }
}

export async function parseResumeWithGroq(resumeText: string) {
    const prompt = `
    You are an expert HR and Career Coach. 
    Extract structured information from the following resume text.
    Resume Text: ${resumeText}

    Return a JSON object with this exact schema:
    {
      "currentRole": "string",
      "experienceLevel": "string (Junior, Mid, Senior, Lead)",
      "skills": ["string"],
      "education": ["string"],
      "summary": "string"
    }
  `;

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that outputs only JSON.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
}
