import { useState, useCallback, useEffect } from "react";
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";

interface Callbacks<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
}

interface UseDataResponse<T> {
  isLoading: boolean;
  isError: boolean;
  data: T | null;
  refetch: () => void;
  mutate: (requestConfig: AxiosRequestConfig, callbacks?: Callbacks<T>) => void;
}

function useQuery<T>(
  initialData: T | null = null,
  enabled: boolean = false
): UseDataResponse<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const sendRequest = useCallback(
    async (requestConfig: AxiosRequestConfig, callbacks?: Callbacks<T>) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response: AxiosResponse<T> = await axios(requestConfig);
        setData(response.data);
        setIsLoading(false);
        callbacks?.onSuccess?.(response.data);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
        callbacks?.onError?.(error as AxiosError);
      }
    },
    []
  );

  const refetch = useCallback(() => {
    sendRequest({ ...(axios.defaults as AxiosRequestConfig) });
  }, [sendRequest]);

  const mutate = useCallback(
    (requestConfig: AxiosRequestConfig, options?: Callbacks<T>) => {
      sendRequest(requestConfig, options);
    },
    [sendRequest]
  );

  useEffect(() => {
    if (enabled) {
      sendRequest({ ...(axios.defaults as AxiosRequestConfig) });
    }
  }, [enabled, sendRequest]);

  return {
    isLoading,
    isError,
    data,
    refetch,
    mutate,
  };
}

export default useQuery;
