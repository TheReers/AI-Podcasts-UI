import { NextApiResponse } from "next"
import { verifyToken } from "../utils/token"
import { isValidJwtHeader } from "../utils/validator"
import userModel, { IUser } from "../db/models/user.model"
import { connectToDB } from "../db/connect"

type BaseRequest = Request & { user?: IUser }

export type Handler = (req: BaseRequest, res: NextApiResponse) => Promise<Response>

export const requiresLogin = (handler: Handler) => {
    return async (req: BaseRequest, res: NextApiResponse) => {
        const dbConnection = await connectToDB()
        if (dbConnection.error) {
            return Response.json({ message: 'Something went wrong' }, { status: 500 })
        }

        const authHeader = req.headers.get('Authorization')
        if (!isValidJwtHeader(authHeader)) {
            return Response.json({ message: 'Authorization header is required' }, { status: 401 })
        }

        const token = authHeader!.split(' ')[1]
        const tokeResp = verifyToken(token)
        if (tokeResp.error || !tokeResp.data) {
            return Response.json({ message: tokeResp.error }, { status: 401 })
        }

        const userExists = await userModel.findOne({ _id: tokeResp.data._id })
        if (!userExists) {
            return Response.json({ message: 'Invalid token' }, { status: 401 })
        }

        if (userExists.tokens.auth.access !== token) {
            return Response.json({ message: 'Invalid token' }, { status: 401 })
        }

        req.user = userExists
        return handler(req, res)
    }
}

