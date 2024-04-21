import type { NextRequest, NextResponse } from "next/server"
import { IUser } from "../db/models/user.model"

export type Params = { [key: string]: string }
export type BaseRequest = NextRequest & { user?: IUser; params: Params }
export type Handler = (req: BaseRequest, res: NextResponse) => Promise<Response>
