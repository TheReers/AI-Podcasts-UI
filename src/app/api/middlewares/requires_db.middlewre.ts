import type { NextResponse } from "next/server"
import { connectToDB } from "../db/connect"
import { BaseRequest, Handler, Params } from "./types"

export const requiresDB = (handler: Handler) => {
    return async (req: BaseRequest, { params }: { params: Params, }, res: NextResponse) => {
        const startAt = Date.now()

        const dbConnection = await connectToDB()
        if (dbConnection.error) {
            return Response.json({ message: 'Something went wrong' }, { status: 500 })
        }

        req.params = params
        const resp = await handler(req, res)
        // add new header to response
        resp.headers.set('X-Response-Time', `${Date.now() - startAt}ms`)
        return resp
    }
}
