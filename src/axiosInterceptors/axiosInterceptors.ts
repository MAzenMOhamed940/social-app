import axios from "axios";
import { router } from "../Routing/AppRouter/AppRouter.tsx";

const axiosInter = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
});



axiosInter.interceptors.request.use(
  function (req) {
    if (localStorage.getItem("tkn")) {
      req.headers.token = localStorage.getItem("tkn");
    }

    return req;
  },

  function (error) {
    return Promise.reject(error);
  },
);
axiosInter.interceptors.response.use(
  function (res) {
    return res;
  },

  function (error) {
    if(error.response && error.response.status === 401){
        router.navigate("/login")
    }
    return Promise.reject(error);
  },
);


export default axiosInter;