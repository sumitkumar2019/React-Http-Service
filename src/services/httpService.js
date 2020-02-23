import axios from "axios";
import { toast } from "react-toastify";
import logger from "./services/logService";

/**To intercept a request or response */
//axios.interceptors.response.use(success, eror);
//axios.interceptors.request.use(success, eror);

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status <= 500;
  if (!expectedError) {
    logger.log(error);
    console.log("Logging the error :" + error);
    toast.error("An Unexpected Error occured");
  }
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete
};
