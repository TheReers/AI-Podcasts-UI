import { Api } from "../../service/axios";

export const getAllPodcasts = async () => {
  try {
    const res = await Api.get(`/api/podcasts`);
    console.log("res:", res);

    return res;
  } catch (error: any) {
    throw new Error(error ?? "Something went wrong");
  }
};
