import axios from "axios";
import type { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
  withCredentials: true, // Send cookies in every single request
});

const apiRequest = async <T>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  data?: any
): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance({
    method,
    url,
    data,
  });

  return response.data;
};

export default apiRequest;
