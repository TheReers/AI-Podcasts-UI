import { NextApiResponse } from "next"
import { IUser } from "../db/models/user.model"

export type Params = { [key: string]: string }
export type BaseRequest = Request & { user?: IUser }
export type Handler = (req: BaseRequest, { params }: { params: Params }, res: NextApiResponse) => Promise<Response>
