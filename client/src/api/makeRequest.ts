import { AxiosRequestConfig } from "axios";
import axios from "./axios";

async function makeRequest(
  url: string,
  options: AxiosRequestConfig
): Promise<any> {
  try {
    const res = await axios(url, options);
    return res?.data;
  } catch (error: any) {
    Promise.reject(error?.response?.data?.message);
  }
}

function makeRequestFn(url: string, options: AxiosRequestConfig) {
  return async function (data?: any) {
    return await makeRequest(url, { ...options, data: data });
  };
}

export { makeRequest, makeRequestFn };
