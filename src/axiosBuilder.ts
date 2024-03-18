import axios, { AxiosRequestConfig } from "axios";
import qs from "query-string";

const baseURL = `${import.meta.env.VITE_DADATA_URL}`;

const accessTokenHeaderInterceptor = (config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }

  config.headers = {
    Accept: "application/json",
  };

  // config.headers["Authorization"] = "Token e9131afdaa36cb065382c3333c43e1844fa52a0e";
  // config.headers["X-Secret"] = "b7e1a5b6ffe593faeb805dc50d9be92e178f26d8";
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
