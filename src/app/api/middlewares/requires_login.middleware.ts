import type { NextResponse } from "next/server"
import { verifyToken } from "../utils/token.util"
import { isValidJwtHeader } from "../utils/validator.util"
import userModel from "../db/models/user.model"
import { connectToDB } from "../db/connect"
import { BaseRequest, Handler, Params } from "./types"
import { requiresDB } from "./requires_db.middlewre"

export const requiresLogin = (handler: Handler) => {
    return requiresDB(async (req: BaseRequest, res: NextResponse) => {
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
        const resp = await handler(req, res)
        return resp
    })
}
