import axios, { AxiosInstance } from "axios";
import { setupInterceptorsTo } from "./interceptors";
import envs from "../../envs";

const client: AxiosInstance = axios.create({ baseURL: envs.baseUrl });

export const Api = setupInterceptorsTo(client);

export const handleApiError = (error: any) => {
  if (error.response)
    return {
      message: error.response.data.message,
      status: error.response.status,
    };

  if (error.message) return error.message;

  const { response } = error;
  const { data } = response;

  switch (response.status) {
    case 400:
      return (
        (data.error && JSON.stringify(data.error)) ||
        data.message ||
        "Something went wrong"
      );
    case 404:
      return data.message || "Resource not found";
    case 409:
      return "A duplicate already eists";
    case 401:
      return "Unauthorized";
    default:
      return "Something went wrong";
  }
};

export default Api;
