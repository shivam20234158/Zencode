import axios from "axios";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

axiosClient.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {},
                    {
                        withCredentials: true,
                    }
                );

                return axiosClient(originalRequest);

            } catch (refreshError) {

                return Promise.reject(refreshError);

            }

        }

        return Promise.reject(error);

    }

);

export default axiosClient;