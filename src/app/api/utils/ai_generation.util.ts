import envs from "../envs"
import http from "./http.util"

interface ChatCompletionResponse {
    choices: {
        message: {
            index: number
            content: string
            finish_reason: string
        }
    }[]
    id: string
    object: string
    created: number
    model: string
    usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number },
    system_fingerprint: string
}

interface ChatCompletionRequest {
    model: string
    messages: { role: string; content: string }[]
    response_format: { type: 'text' | 'json_object' },
    temperature: number
}

interface TextToAudioRequest {
    model: 'tts-1',
    input: string,
    voice: 'alloy'
}

export default class AI {
    private baseUrl = 'https://api.openai.com/v1'
    private model = 'gpt-4-turbo-preview'
    private podcastTitle = 'Reers Podcast show'
    private apiKey = envs.openAI.apiKey
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

    private getHostNames() {
        const hostNames = ['Ezra', 'Emery', 'Kai', 'Nova', 'August', 'Jett']
        return hostNames.join(', ')
    }

    async generatePodcastText(message: string) {
        const start = Date.now()
        const validation = this.validateApiKeyAndMessage(message)
        if (validation.error) {
            return validation
        }

        const messages = [
            {
                role:  "system",
                content:  `You are a podcast generator.
                Your job is to generate a podcast for the following prompt,
                no extra formats like bold just characters that is a pure string.
                The podcast should talk in-depth about the topic and should be at least 500 words long.

                The podcast is anchored by any one or two of ${this.getHostNames()}
                The name of the podcast is ${this.podcastTitle}.

                If the podcast title is gender based, use the best name for the anchor.
                Also, for the podcast title, it can change to a better name that fits the title if the title seems
                a bit opinionated.
                `
            },
            {
                role: 'user',
                content: `prompt: generate a podcast for ${message}\n`
            }
        ]

        const generatePodcastTextRequest = await http.post<ChatCompletionRequest, ChatCompletionResponse>(
            `${this.baseUrl}/chat/completions`,
            {
                model: this.model,
                messages,
                response_format: { type: 'text' },
                temperature: 0.7
            },
            this.headers
        )

        if (generatePodcastTextRequest.error || !generatePodcastTextRequest.data) {
            return {
                error: generatePodcastTextRequest.error?.error?.message || 'Something went wrong',
                message: 'Could not generate podcast text.'
            }
        }

        const end = Date.now()
        console.log(`Time taken to generate podcast text: ${(end - start)}ms`)
        return {
            data: generatePodcastTextRequest.data.choices?.[0].message.content
        }
    }

    async convertToAudio(text: string) {
        const start = Date.now()
        const validation = this.validateApiKeyAndMessage(text)
        if (validation.error) {
            return validation
        }

        const voice = 'alloy'
        const textToAudioRequest = await http.post<TextToAudioRequest, ArrayBuffer>(
            `${this.baseUrl}/audio/speech`,
            {
                model: 'tts-1',
                input: text,
                voice: voice
            },
            this.headers,
            'arraybuffer'
        )

        if (textToAudioRequest.error || !textToAudioRequest.data) {
            return {
                error: textToAudioRequest.error?.error?.message || 'Something went wrong',
                message: 'Error generating audio',
            }
        }

        const bufferResponse = Buffer.from(textToAudioRequest.data)
        const end = Date.now()
        console.log(`Time taken to convert podcast text to audio: ${(end - start)}ms`)
        return { data: bufferResponse }
    }
}
