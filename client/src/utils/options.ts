import { AxiosRequestConfig } from "axios";

const DELETE_OPTIONS: AxiosRequestConfig = {
  method: "DELETE",
};

const GET_OPTIONS: AxiosRequestConfig = {
  method: "GET",
};

const POST_OPTIONS: AxiosRequestConfig = {
  method: "POST",
};

const PATCH_OPTIONS: AxiosRequestConfig = {
  method: "PATCH",
};

export { DELETE_OPTIONS, GET_OPTIONS, POST_OPTIONS, PATCH_OPTIONS };
