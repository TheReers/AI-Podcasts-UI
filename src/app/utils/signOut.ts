import { signOut } from "next-auth/react";
import { Api, handleApiError } from "../service/axios";
import envs from "../../envs";

export const signOutUser = async () => {
  try {
    signOut({ callbackUrl: `${envs.baseUrl}/login` });
    await Api.post("/api/logout");
  } catch (error) {
    handleApiError(error);
  }
};
