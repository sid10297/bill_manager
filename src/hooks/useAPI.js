import { useCallback, useEffect, useState } from "react";

import axiosInstance from "../apis";

export const useAPI = ({ path, method = "get", params, payload }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const makeRequest = useCallback(
    (newPayload, newParams, addToPath) => {
      setIsLoading(true);
      setIsSuccess(false);
      axiosInstance
        .request({
          url: addToPath ? `${path}/${addToPath}` : path,
          method,
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
        .catch((e) => setError(e))
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
