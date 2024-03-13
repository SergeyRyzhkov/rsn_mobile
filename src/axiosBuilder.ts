import axios from "axios";
import qs from "query-string";
import { useRouter } from "vue-router";

const router = useRouter();

export const createAxiosInstance = (withCredentials = false) => {
  const inst = axios.create({
    withCredentials: withCredentials,
    paramsSerializer: (params: any) => qs.stringify(params, { skipNull: true, arrayFormat: "bracket" }),
  });
  return inst;
};
