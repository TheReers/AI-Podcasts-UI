export default class AI {
    private baseUrl = 'https://api.openai.com/v1'
    private model = 'gpt-3.5-turbo'
    private apiKey = process.env.NEXT_OPEN_AI_API_KEY || ''
    private headers: { [key: string]: string }

    constructor () {
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
        }
    }

    private validateApiKey() {
        if (!this.apiKey) {
            return {
                error: 'API key is required',
                message: 'Could not generate podcast.'
            }
        }

        return { data: true }
    }

    private validateMessage(message: string) {
        if (!message) {
            return {
                error: 'message is required',
                message: 'Could not generate podcast.'
            }
        }

        return { data: true }
    }

    private validateApiKeyAndMessage(message: string) {
        const apiKeyValidation = this.validateApiKey()
        if (apiKeyValidation.error) {
            return {
                error: apiKeyValidation.error,
                message: apiKeyValidation.message
            }
        }

        const messageValidation = this.validateMessage(message)
        if (messageValidation.error) {
            return {
                error: messageValidation.error,
                message: messageValidation.message
            }
        }

        return { data: true }
    }

    async generatePodcastText(message: string) {
        const validation = this.validateApiKeyAndMessage(message)
        if (validation.error) {
            return validation
        }

        const messages = [{ role:  "system", content:  `You are a podcast generator.
    Your job is to generate a podcast for the following prompt, no extra formats like bold just characters that is a pure string.`}]
        messages.push({ role: 'user', content: `prompt: generate a podcast for ${message}\n` })

        const api = await fetch(
            `${this.baseUrl}/chat/completions`,
            {
                method: 'POST',
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    response_format: { type: 'text' },
                    temperature: 0.7
                }),
                headers: this.headers
            }
        )

        const statusCode = api.status
        const response = await api.json()
        if (statusCode !== 200) {
            return {
                error: response.error,
                message: 'Could not generate podcast.'
            }
        }

        if (response.error) {
            return {
                error: response.error,
                message: 'Could not generate podcast.'
            }
        }

        return {
            data: response.choices?.[0].message.content
        }
    }

    async convertToAudio(text: string) {
        const validation = this.validateApiKeyAndMessage(text)
        if (validation.error) {
            return validation
        }

        const voice = 'alloy'
        const api = await fetch(
            `${this.baseUrl}/audio/speech`,
            {
                method: 'POST',
                body: JSON.stringify({
                    model: 'tts-1',
                    input: text,
                    voice: voice
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
        return { data: response }
    }
}
