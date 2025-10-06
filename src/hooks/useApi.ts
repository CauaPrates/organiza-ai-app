import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> extends LoadingState {
  data: T | null;
  execute: () => Promise<void>;
  reset: () => void;
}

export const useApi = <T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) => {
  const { immediate = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    
    try {
      const response = await apiFunction();
      
      if (response.success) {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || 'Erro desconhecido';
        setLoading({ isLoading: false, error: errorMessage });
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na requisição';
      setLoading({ isLoading: false, error: errorMessage });
      onError?.(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, isLoading: false }));
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setLoading({ isLoading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading: loading.isLoading,
    error: loading.error,
    execute,
    reset,
  };
};

export default useApi;