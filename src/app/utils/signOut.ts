import { signOut } from "next-auth/react";
import { Api, handleApiError } from "../service/axios";




export const signOutUser = async (token:string) => {
    try {
        if(!token) throw new Error("No token provided");
        await Api.post("/api/logout",{},{headers: {Authorization: `Bearer ${token}`}});
        await signOut();
    } catch (error) {
        handleApiError(error);
    }
}