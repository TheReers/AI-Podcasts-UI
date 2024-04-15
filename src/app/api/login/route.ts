import { LoginDto, validateLogin } from '../utils/validator.util'
import { comparePwd } from '../utils/hashing.util'
import { createAuthTokens } from '../utils/token.util'
import userModel from '../db/models/user.model'
import { requiresDB } from '../middlewares/requires_db.middlewre'
import { Handler } from '../middlewares/types'
import parseRequestBody from '../utils/get_request_body.util'

const login: Handler = async (req) => {
    const body: LoginDto = await parseRequestBody(req)
    if (!body) {
        return Response.json({ message: 'Invalid request payload provided' }, { status: 400 })
    }

    const validationResult = validateLogin(body)
    if (!validationResult.valid || !validationResult.data) {
        return Response.json(
            {
                message: 'Invalid request payload provided',
                errors: validationResult.errors
            },
            { status: 400 }
        )
    }

    const { data } = validationResult
    const userExist = await userModel.findOne({ email: data.email })
    if (!userExist) {
        return Response.json({ message: 'Invalid email or password' }, { status: 400 })
    }

    const comparePassword = await comparePwd(data.password, userExist.password)
    if (!comparePassword) {
        return Response.json({ message: 'Invalid email or password' }, { status: 400 })
    }

    const tokens = await createAuthTokens(userExist)

    return Response.json({
        message: 'Login successful',
        data: { user: userExist.toJSON(), tokens }
    })
}

export const POST = requiresDB(login)
