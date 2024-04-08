import { signOut } from "next-auth/react";
import { Api, handleApiError } from "../service/axios";

export const signOutUser = async () => {
    try {
        await Api.post("/api/logout");
        await signOut();
    } catch (error) {
        handleApiError(error);
    }
}
