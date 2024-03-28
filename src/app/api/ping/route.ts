import type { NextApiResponse } from 'next'

export async function GET(req: Request, res: NextApiResponse) {
    return Response.json({ message: 'pong' })
}
