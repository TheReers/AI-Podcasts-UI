import { redirect } from "next/navigation"
import toast from "react-hot-toast"
import { dateIsGreaterThanOther } from "../api/utils/date.util"

export const forceLogoutOnClientIfTokenHasExpired = (session: any )=> {
    const expires = session?.expires
    const error = session?.error
    if ((
        expires && dateIsGreaterThanOther(new Date(), new Date(expires))) ||
        error === 'RefreshAccessTokenError'
    ) {
        toast.error("Authentication failed")
        redirect('/')
    }
}
