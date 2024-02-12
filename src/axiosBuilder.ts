import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "query-string";
import { useRouter } from "vue-router";

const router = useRouter();

export const createAxiosInstance = (withCredentials = false) => {
  const inst = axios.create({
    withCredentials: withCredentials,
  });
  return inst;
};
