import { requiresLogin } from '../middlewares/requires_login.middleware'
import { Handler } from '../middlewares/types'
import parseRequestBody from '../utils/get_request_body.util'

const sendMessage: Handler = async (req) => {
    const { user } = req
    if (!user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await parseRequestBody(req)
    if (!body) {
        return Response.json({ error: 'Invalid request payload provided' }, { status: 400 })
    }

    const { message } = body
    if (!message) {
        return Response.json({ error: 'message is required' }, { status: 400 })
    }

    return Response.json({ message })
}

export const POST = requiresLogin(sendMessage)
