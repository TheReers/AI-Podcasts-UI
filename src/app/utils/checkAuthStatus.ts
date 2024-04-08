import { redirect } from "next/navigation";

export const checkAuthStatus = (
  status: "authenticated" | "loading" | "unauthenticated"
) => {
  if (status === "authenticated") redirect("/dashboard");
};
