import { redirect } from "next/navigation"
import toast from "react-hot-toast"

export const forceLogoutOnClientIfTokenHasExpired = (session: any )=> {
    const expires = session?.expires
    const error = session?.error
    if ((
        expires && new Date() > new Date(expires)) ||
        error === 'RefreshAccessTokenError'
    ) {
        toast.error("Authentication failed")
        redirect('/')
    }
}
