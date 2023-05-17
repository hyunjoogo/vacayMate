import { AxiosError } from "axios";

export const all = (error: unknown) => {
  const errorResponse = error as AxiosError;
  let { message, status } = errorResponse.response!.data as AxiosError;
  switch (status) {
    case 400:
      break;
    case 401:
      break;
    default:
      break;
  }

  alert(message);
};
