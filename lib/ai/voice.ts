"use server"

import { groq } from "./groq-client";

export async function transcribeAudio(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const transcription = await groq.audio.transcriptions.create({
        file: file,
        model: "whisper-large-v3",
        response_format: "json",
    });

    return transcription.text;
}
