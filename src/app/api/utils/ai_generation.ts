export default class AI {
    private baseUrl = 'https://api.openai.com/v1/chat'
    private model = 'gpt-4-turbo-preview'
    private apiKey = process.env.NEXT_OPEN_AI_API_KEY || ''
    private headers: { [key: string]: string }

    constructor () {
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
        }
    }

    async generatePodcastText(message: string) {
        if (!this.apiKey) {
            return {
                error: 'API key is required',
                message: 'Could not generate podcast.'
            }
        }

        if (!message) {
            return {
                error: 'message is required',
                message: 'Could not generate podcast.'
            }
        }

        const messages = [{ role:  "system", content:  `You are a podcast generator.
    Your job is to generate a podcast for the following prompt, no extra formats like bold just characters that is a pure string.`}]
        messages.push({ role: 'user', content: `prompt: generate a podcast for ${message}\n` })

        const api = await fetch(
            `${this.baseUrl}/completions`,
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

}
