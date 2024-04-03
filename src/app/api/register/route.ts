import type { NextApiResponse } from 'next'
import { validateSignup } from '../utils/validator'
import { hashPwd } from '../utils/hashing'

interface Register {
    email: string
    password: string
    confirm_password: string
}

export async function POST(req: Request, res: NextApiResponse) {
    const body: Register = await req.json()
    const validationResult = validateSignup(body.email, body.password, body.confirm_password)
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
    const comparePassword = await hashPwd(data.password)
    data.password = comparePassword

    return Response.json({ message: 'Signup successful', data })
}
