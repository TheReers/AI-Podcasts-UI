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
    private apiKey: string = process.env.NEXT_ELEVEN_LABS_API_KEY || ''

    constructor() {
        this.headers = {
            "Accept": "application/json",
            "xi-api-key": this.apiKey,
            "Content-Type": "application/json"
        }
    }

    async setVoices(): Promise<Voice[]> {
        if (this.voices.length) return this.voices
        const api = await fetch(`${this.base_url}/voices`, {
            headers: this.headers
        })

        const response = await api.json()

        this.voices = response.voices.map((voice: any) => ({
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
        const api = await fetch(
            `${this.base_url}/text-to-speech/${voice.id}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    model_id: 'eleven_monolingual_v1',
                    text: text.length > 2500 ? text.substring(0, 2500) : text,
                    voice_settings: {
                        similarity_boost: 0.5,
                        stability: 0.5
                    }
                }),
                headers: this.headers
            }
        )

        const statusCode = api.status
        const mimetype = api.headers.get('Content-Type')
        if (statusCode !== 200) {
            return {
                message: 'Error generating audio',
                error: await api.json()
            }
        }

        if (mimetype !== 'audio/mpeg') {
            return {
                error: 'Error generating audio',
                message: 'Invalid audio format'
            }
        }

        const response = await api.blob()
        return response
    }
}