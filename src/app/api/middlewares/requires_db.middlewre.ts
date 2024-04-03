import { NextApiResponse } from "next"
import { IUser } from "../db/models/user.model"
import { connectToDB } from "../db/connect"

type BaseRequest = Request & { user?: IUser }

export type Handler = (req: BaseRequest, res: NextApiResponse) => Promise<Response>

export const requiresDB = (handler: Handler) => {
    return async (req: BaseRequest, res: NextApiResponse) => {
        const dbConnection = await connectToDB()
        if (dbConnection.error) {
            return Response.json({ message: 'Something went wrong' }, { status: 500 })
        }

        return handler(req, res)
    }
}

