import { requiresLogin } from '../middlewares/requires_login.middleware'
import { Handler } from '../middlewares/types'

const logout: Handler = async (req) => {
    const { user } = req
    if (!user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    user.tokens.auth = {}
    await user.save()

    return Response.json({ message: 'Logout successful' })
}

export const POST = requiresLogin(logout)
