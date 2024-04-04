import type { NextApiResponse } from 'next'
import { RegisterDto, validateSignup } from '../utils/validator'
import { hashPwd } from '../utils/hashing'
import { createNewUser } from '../db/models/user.model'
import { requiresDB } from '../middlewares/requires_db.middlewre'

const register = async (req: Request, res: NextApiResponse) => {
    const body: RegisterDto = await req.json()
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
        return Response.json({ message: createUser.error || 'Something went wrong' }, { status: createUser.status || 500 })
    }

    return Response.json({ message: 'Signup successful', data: createUser.data.toJSON() })
}

export const POST = requiresDB(register)
