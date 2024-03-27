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

    const audioResponse = await ai.convertToAudio(messageResponse.data)
  
    if (audioResponse.data instanceof Blob)  {
      const buffer = Buffer.from(await audioResponse.data.arrayBuffer())
      return new Response((buffer), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'attachment; filename=podcast.mp3',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
    }

    return Response.json(audioResponse, { status: 500 })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: (error as any).statusCode || 500 })
  }
}
