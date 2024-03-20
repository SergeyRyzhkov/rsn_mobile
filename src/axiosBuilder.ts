import axios, { AxiosRequestConfig } from "axios";
import qs from "query-string";

const baseURL = `${import.meta.env.VITE_DADATA_URL}`;

const accessTokenHeaderInterceptor = (config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }

  config.headers = {
    ...config.headers,
    Accept: "application/json",
  };
};

export const createAxiosInstance = (withCredentials = false) => {
  const inst = axios.create({
    baseURL,
    withCredentials: withCredentials,
    paramsSerializer: (params: any) => qs.stringify(params, { skipNull: true, arrayFormat: "bracket" }),
  });
  inst.interceptors.request.use((config) => {
    accessTokenHeaderInterceptor(config);
    return config;
  });
  return inst;
};
