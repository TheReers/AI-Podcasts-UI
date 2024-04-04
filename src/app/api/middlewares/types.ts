import { NextApiResponse } from "next"
import { IUser } from "../db/models/user.model"

export type BaseRequest = Request & { user?: IUser }
export type Handler = (req: BaseRequest, res: NextApiResponse) => Promise<Response>
