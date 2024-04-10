import { isValidJwtHeader } from '../utils/validator.util'
import { TokenType, createAuthTokens, verifyToken } from '../utils/token.util'
import userModel from '../db/models/user.model'
import { requiresDB } from '../middlewares/requires_db.middlewre'
import { Handler } from '../middlewares/types'

const refreshAuthToken: Handler = async (req) => {
    const body: { token: string } = await req.json()
    const isValid = isValidJwtHeader(`Bearer ${body.token}`)
    if (!isValid) {
        return Response.json(
            {
                message: 'Invalid request payload provided',
                errors: {
                    token: 'Invalid token provided'
                }
            },
            { status: 400 }
        )
    }

    const verifyTokenResp = verifyToken(body.token, TokenType.REFRESH)
    if (verifyTokenResp.error || !verifyTokenResp.data) {
        return Response.json(verifyTokenResp, { status: 400 })
    }

    const userExist = await userModel.findOne({ _id: verifyTokenResp.data._id })
    if (!userExist) {
        return Response.json({ message: 'Invalid token' }, { status: 400 })
    }


    const tokens = await createAuthTokens(userExist)
    return Response.json({
        message: 'Refresh auth token successful',
        data: { tokens }
    })
}

export const POST = requiresDB(refreshAuthToken)
