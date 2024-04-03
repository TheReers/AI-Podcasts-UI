import { NextApiResponse } from "next"
import { verifyToken } from "../utils/token"
import { isValidJwtHeader } from "../utils/validator"

type BaseRequest = Request & { [key: string]: any }

export type Handler = (req: BaseRequest, res: NextApiResponse) => Promise<Response>

export const requiresLogin = (handler: Handler) => {
    return async (req: BaseRequest, res: NextApiResponse) => {
        const authHeader = req.headers.get('Authorization')
        if (!isValidJwtHeader(authHeader)) {
            return Response.json({ message: 'Authorization header is required' }, { status: 401 })
        }

        const token = authHeader!.split(' ')[1]
        const tokeResp = verifyToken(token)
        if (tokeResp.error || !tokeResp.data) {
            return Response.json({ message: tokeResp.error }, { status: 401 })
        }

        req.user = tokeResp.data
        return handler(req, res)
    }
}
