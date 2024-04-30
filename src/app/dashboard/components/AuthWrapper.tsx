import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Props {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: Props) {
    const session = useSession();
    if (session.status === "loading") return null;
    const expires = session.data?.expires
    const error = (session.data as any)?.error
    const hasExpired = expires && new Date() > new Date(expires)
    const hasError = error === 'RefreshAccessTokenError'
    if (
        session.status === "unauthenticated" ||
        (hasExpired || hasError)
    ) {
        return redirect("/login");
    }

    return children;
}
