import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://reacttestprojectapi.azurewebsites.net/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: localStorage.getItem("token")
      ? localStorage.getItem("token")
      : null,
  },
});

axiosInstance.interceptors.request.use((request) => {
  request.headers.set("Authorization", localStorage.getItem("token"));
  return request;
});

export default axiosInstance;
