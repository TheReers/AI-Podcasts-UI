import { NextApiResponse } from "next"
import { connectToDB } from "../db/connect"
import { BaseRequest, Handler } from "./types"

export const requiresDB = (handler: Handler) => {
    return async (req: BaseRequest, res: NextApiResponse) => {
        const dbConnection = await connectToDB()
        if (dbConnection.error) {
            return Response.json({ message: 'Something went wrong' }, { status: 500 })
        }

        return handler(req, res)
    }
}
