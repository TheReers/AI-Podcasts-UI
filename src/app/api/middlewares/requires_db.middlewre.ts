import { NextApiResponse } from "next"
import { connectToDB } from "../db/connect"
import { BaseRequest, Handler, Params } from "./types"

export const requiresDB = (handler: Handler) => {
    return async (req: BaseRequest, { params }: { params: Params }, res: NextApiResponse) => {
        const startAt = Date.now()

        const dbConnection = await connectToDB()
        if (dbConnection.error) {
            return Response.json({ message: 'Something went wrong' }, { status: 500 })
        }

        const resp = await handler(req, { params }, res)
        // add new header to response
        resp.headers.set('X-Response-Time', `${Date.now() - startAt}ms`)
        return resp
    }
}
