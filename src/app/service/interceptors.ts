import {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    AxiosRequestConfig,
  } from "axios";
  
  import { getSession } from "next-auth/react";
  
  const onRequest = async (
    config: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> => {
    const session = await getSession();
    const token = (session as any)?.token;
    config.headers = {
      ...(config?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    };
    return config;
  };
  
  const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  };
  
  const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
  };
  
  const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  };
  
  export function setupInterceptorsTo(
    axiosInstance: AxiosInstance
  ): AxiosInstance {
    // @ts-ignore
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
  }
  