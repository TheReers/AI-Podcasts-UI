import { Handler, requiresLogin } from '../middlewares/requires_login'

const sendMessage: Handler = async (req) => {
    const { user } = req
    if (!user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await req.json()
    if (!message) {
        return Response.json({ error: 'message is required' }, { status: 400 })
    }

    return Response.json({ message })
}

export const POST = requiresLogin(sendMessage)
