"use client"


interface KokoroInstance {
    // Relaxed interface for dynamic library compatibility
    generate: (text: string, options: Record<string, unknown>) => Promise<{ toBlob: () => Blob }>;
}

export class VoiceEngine {
    private static instance: VoiceEngine;
    private kokoro: KokoroInstance | null = null;
    private isLoading = false;
    private failed = false;

    private constructor() { }

    static getInstance() {
        if (!VoiceEngine.instance) {
            VoiceEngine.instance = new VoiceEngine();
        }
        return VoiceEngine.instance;
    }

    async initialize() {
        if (this.kokoro || this.isLoading || this.failed) return;
        this.isLoading = true;
        try {
            // Dynamic import to avoid SSR issues
            const { KokoroTTS } = await import("kokoro-js");

            this.kokoro = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
                dtype: "q8", // q8 is faster and more compatible
                device: "wasm", // wasm is more stable than webgpu for now
            });
            console.log("Voice Engine Initialized");
        } catch (error) {
            console.error("Failed to initialize Voice Engine:", error);
            this.failed = true;
        } finally {
            this.isLoading = false;
        }
    }

    async speak(text: string, voice: string = "af_heart") {
        if (this.failed) throw new Error("Voice engine failed to initialize");
        if (!this.kokoro) await this.initialize();
        if (!this.kokoro) return;

        try {
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

            for (const sentence of sentences) {
                const rawAudio = await this.kokoro.generate(sentence.trim(), {
                    voice: voice,
                    speed: 1.0,
                });

                const audio = new Audio(URL.createObjectURL(rawAudio.toBlob()));
                audio.play();

                await new Promise(resolve => {
                    audio.onended = resolve;
                    // Fallback timeout
                    setTimeout(resolve, (audio.duration * 1000) + 500);
                });
            }
        } catch (e) {
            console.error("Speech generation failed", e);
            throw e; // Propagate to let basic TTS handle it
        }
    }
}
