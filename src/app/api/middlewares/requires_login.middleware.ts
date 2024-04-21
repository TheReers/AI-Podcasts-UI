import type { NextResponse } from "next/server"
import { verifyToken } from "../utils/token.util"
import { isValidJwtHeader } from "../utils/validator.util"
import userModel from "../db/models/user.model"
import { connectToDB } from "../db/connect"
import { BaseRequest, Handler, Params } from "./types"

export const requiresLogin = (handler: Handler) => {
    return async (req: BaseRequest, { params }: { params: Params, }, res: NextResponse) => {
        const startAt = Date.now()

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
        req.params = params

        const resp = await handler(req, res)
        // add new header to response
        resp.headers.set('X-Response-Time', `${Date.now() - startAt}ms`)
        return resp
    }
}
