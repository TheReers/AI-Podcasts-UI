import { Api, handleApiError } from "../service/axios";
import { signOut } from "next-auth/react";

export const signOutUser = async () => {
  try {
    signOut({ callbackUrl: "http://localhost:3000/login" });
    await Api.post("/api/logout");
  } catch (error) {
    handleApiError(error);
  }
};
