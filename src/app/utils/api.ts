import { FormValues } from "../dashboard/generate/page";
import { Api, handleApiError } from "../service/axios";

export interface Podcast {
  _id: string;
  name: string;
  slug: string;
  url: string;
  transcript: string,
  user: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}


interface GetAllPodcasts {
  data: Podcast[];
  message: string;
}
interface GetDetails {
  data: Podcast;
  message: string;
}
interface CreatePodcast {
  data: Podcast;
  message: string;
  status: string;
}

export const getAllPodcasts = async (search?: string) => {
  try {
    const res = await Api.get<GetAllPodcasts>(`/api/podcasts?slug=${search}`);

    return res.data;
  } catch (error: any) {
    throw new Error(error ?? "Something went wrong");
  }
};
export const getDetails = async (slug?: string|null) => {
  try {
    const res = await Api.get<GetDetails>(`/api/podcasts/${slug}`);

    return res.data;
  } catch (error: any) {
    throw new Error(error ?? "Something went wrong");
  }
};

export const generatePodcast = async (body: FormValues) => {
  try {
    const payload = {
      message: body.message,
    };
    const { data } = await Api.post<CreatePodcast>("/api/podcasts", payload);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};
