import { useCallback, useEffect, useState } from "react";

import axiosInstance from "../apis";

export const useAPI = ({ path, method = "get", params, payload }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const makeRequest = useCallback(
    (newPayload, newParams, newPath) => {
      setIsLoading(true);
      setIsSuccess(false);
      setError(null);

      axiosInstance
        .request({
          method,
          url: newPath || path || {},
          params: newParams || params || {},
          data: newPayload || payload || {},
        })
        .then((response) => {
          if (response.status === 200) {
            setIsSuccess(true);
            setData(response.data);
          } else {
            setError(response.data);
          }
        })
        .catch((e) => setError(prepareErrorMessage(e)))
        .finally(() => setIsLoading(false));
    },
    [method, params, path, payload]
  );

  const refetch = useCallback(() => makeRequest(), [makeRequest]);

  useEffect(() => {
    if (method === "get") {
      makeRequest();
    }
  }, [makeRequest, method]);

  return {
    isLoading,
    error,
    data,
    isSuccess,
    makeRequest,
    refetch,
  };
};

const prepareErrorMessage = (error) => {
  if (typeof error?.response?.data === "string") {
    return error?.response?.data;
  }

  if (
    typeof error?.response?.data === "object" &&
    error?.response?.data?.title
  ) {
    return error?.response?.data?.title;
  }

  return "Something went wrong";
};
