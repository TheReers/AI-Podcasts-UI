import type { NextApiResponse } from 'next'
import TextToAudio from '../utils/text_to_audio'
import AI from '../utils/ai_generation'
 
type ResponseData = {
  data?: string
  error?: string
}

export async function POST(req: Request, res: NextApiResponse<ResponseData>) {
  try {
    const { message } = await req.json()
    if (!message) {
      return Response.json({ error: 'message is required' }, { status: 400 })
    }

    const ai = new AI()
    const messageResponse = await ai.generatePodcastText(message)
    if (messageResponse.error) {
      return Response.json(messageResponse, { status: 400 })
    }

    const textToAudio = new TextToAudio()
    const audioBuffer = await textToAudio.convertToAudio(messageResponse.data, 'Brian')
  
    if (audioBuffer instanceof Blob)  {
      return new Response((audioBuffer as Blob), {
        headers: { 'Content-Type': 'audio/mpeg' }
      })
    }

    return Response.json(audioBuffer, { status: 500 })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: (error as any).statusCode || 500 })
  }
}
