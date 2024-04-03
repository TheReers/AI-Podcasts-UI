import type { NextApiResponse } from 'next'
import { validateLogin } from '../utils/validator'
import { comparePwd } from '../utils/hashing'
import { createAuthTokens } from '../utils/token'

interface LoginDto {
    email: string
    password: string
}

export async function POST(req: Request, res: NextApiResponse) {
    const body: LoginDto = await req.json()
    const validationResult = validateLogin(body.email, body.password)
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
    const comparePassword = await comparePwd(data.password, 'hashed_password')
    if (!comparePassword) {
        return Response.json({ message: 'Invalid email or password' }, { status: 400 })
    }

    delete (data as any).password

    const tokens = createAuthTokens({ email: data.email })

    return Response.json({
        message: 'Login successful',
        data: { user: data, tokens }
    })
}
