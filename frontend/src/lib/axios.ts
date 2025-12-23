import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

//server mange token, so no need to attach token in request
/* === REQUEST INTERCEPTOR === */
// apiClient.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

/* === RESPONSE INTERCEPTOR === */
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`;

    if (originalRequest.url === refreshUrl) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(refreshUrl, {}, { withCredentials: true });

        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
