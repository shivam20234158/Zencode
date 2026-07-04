import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5001/api",
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
                    "http://localhost:5001/api/auth/refresh",
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