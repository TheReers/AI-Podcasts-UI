import type { NextApiResponse } from 'next'
 
type ResponseData = {
  data?: string
  error?: string
}

export async function POST(req: Request, res: NextApiResponse<ResponseData>) {
    const { message } = await req.json()
    if (!message) {
      return Response.json({ error: 'message is required' }, { status: 400 })
    }

    return Response.json({ data: 'success' })
}
