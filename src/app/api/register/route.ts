import { RegisterDto, validateSignup } from '../utils/validator.util'
import { hashPwd } from '../utils/hashing.util'
import { createNewUser } from '../db/models/user.model'
import { requiresDB } from '../middlewares/requires_db.middlewre'
import { Handler } from '../middlewares/types'
import parseRequestBody from '../utils/get_request_body.util'
import { createAuthTokens } from '../utils/token.util'

const register: Handler = async (req) => {
    const body: RegisterDto = await parseRequestBody(req)
    if (!body) {
        return Response.json({ message: 'Invalid request payload provided' }, { status: 400 })
    }

    const validationResult = validateSignup(body)
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
    const hashPassword = await hashPwd(data.password)

    const createUser = await createNewUser({
        email: data.email,
        password: hashPassword,
        name: data.name,
    })

    if (createUser.error || !createUser.data) {
        return Response.json({ message: createUser.error || 'Something went wrong' }, { status: 400 })
    }

    const tokens = await createAuthTokens(createUser.data)

    return Response.json({ message: 'Signup successful', data: { user: createUser.data.toJSON(), tokens } }, { status: 201 })
}

export const POST = requiresDB(register)
