import axios from "axios";
const { getAccessToken, getRefreshToken, setAccessToken } = {
  getAccessToken: () => "test",
  getRefreshToken: () => "test",
  setAccessToken: () => "test",
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/* === REQUEST INTERCEPTOR === */
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* === RESPONSE INTERCEPTOR === */
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Token hết hạn
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const newToken = res.data?.accessToken || "";
        setAccessToken();

        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
