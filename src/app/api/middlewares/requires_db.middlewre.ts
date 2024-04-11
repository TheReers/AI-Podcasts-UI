import { NextApiResponse } from "next"
import { connectToDB } from "../db/connect"
import { BaseRequest, Handler, Params } from "./types"

export const requiresDB = (handler: Handler) => {
    return async (req: BaseRequest, { params }: { params: Params }, res: NextApiResponse) => {
        const dbConnection = await connectToDB()
        if (dbConnection.error) {
            return Response.json({ message: 'Something went wrong' }, { status: 500 })
        }

        return handler(req, { params }, res)
    }
}
