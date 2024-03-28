import type { NextApiResponse } from 'next'

export async function POST(req: Request, res: NextApiResponse) {
    const { message } = await req.json()
    if (!message) {
      return Response.json({ error: 'message is required' }, { status: 400 })
    }

    return Response.json({ message })
}
