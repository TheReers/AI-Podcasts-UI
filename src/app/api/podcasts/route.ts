import AI from '../utils/ai_generation.util'
import fs from 'fs'
import { requiresLogin } from '../middlewares/requires_login.middleware'
import { Handler } from '../middlewares/types'

const createPodcast: Handler = async (req) => {
  const { message } = await req.json()
  if (!message) {
    return Response.json({ error: 'message is required' }, { status: 400 })
  }

  const ai = new AI()
  const messageResponse = await ai.generatePodcastText(message)
  if (messageResponse.error || !messageResponse.data) {
    return Response.json(messageResponse, { status: 400 })
  }

  const audioResponse = await ai.convertToAudio(messageResponse.data)
  if (audioResponse.error || !audioResponse.data) {
    return Response.json(audioResponse, { status: 400 })
  }

  return new Response(audioResponse.data, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename=podcast.mp3'
    }
  })
}

export const POST = requiresLogin(createPodcast)
