import envs from "../envs"
import http from "./http.util"

interface TextToAudioRequest {
    model_id: 'eleven_monolingual_v1',
    text: string
    voice_settings: { similarity_boost: number, stability: number }
}

interface Voice {
    id: string
    name: string
    category: string
    preview_url: string
}
export default class TextToAudio {
    voices: Voice[] = []
    private base_url: string = 'https://api.elevenlabs.io/v1'
    private headers: { [key: string]: string }
    private apiKey: string = envs.elevenLabs.apiKey

    constructor() {
        this.headers = {
            "Accept": "audio/mpeg",
            "xi-api-key": this.apiKey,
            "Content-Type": "application/json"
        }
    }

    async setVoices(): Promise<Voice[]> {
        if (this.voices.length) return this.voices
        const getVoiceRequest = await http.get<{}, { voices: Voice[] }>(`${this.base_url}/voices`, this.headers)

        if (getVoiceRequest.error || !getVoiceRequest.data) {
            return []
        }

        this.voices = getVoiceRequest.data.voices.map((voice: any) => ({
            category: voice.category,
            name: voice.name,
            preview_url: voice.preview_url,
            id: voice.voice_id
        }))
        return this.voices
    }

    async getVoiceIdById(id: string) {
        if (!this.voices.length) await this.setVoices()
        return this.voices.find((voice) => voice.id === id);
    }

    async getVoiceByName(name: string) {
        if (!this.voices.length) await this.setVoices()
        return this.voices.find((voice) => voice.name.toLowerCase() === name.toLowerCase());
    }

    async convertToAudio(text: string, voice_name: string) {
        const start = Date.now()
        if (!this.apiKey) {
            return {
                error: 'API key is required',
                message: 'Could not generate podcast.'
            }
        }

        if (!text) {
            return {
                error: 'text is required',
                message: 'Could not generate podcast.'
            }
        }

        const voice = await this.getVoiceByName(voice_name) || this.voices[0]
        const textToAudioRequest = await http.post<TextToAudioRequest, ArrayBuffer>(
            `${this.base_url}/text-to-speech/${voice.id}`,
            {
                model_id: 'eleven_monolingual_v1',
                text: text.length > 2500 ? text.substring(0, 2500) : text,
                voice_settings: { similarity_boost: 0.5, stability: 0.5 }
            },
            this.headers,
            'arraybuffer'
        )

        if (textToAudioRequest.error || !textToAudioRequest.data) {
            return {
                error: textToAudioRequest.error?.detail?.message || 'Something went wrong',
                message: 'Error generating audio',
            }
        }

        const bufferResponse = Buffer.from(textToAudioRequest.data)
        const end = Date.now()
        console.log(`Time taken to convert podcast text to audio: ${(end - start)}ms`)
        return { data: bufferResponse }
    }
}
