import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; 

/**
 * Hook personalizado para obtener datos de una ruta de API (tu backend local).
 * @param {string} endpoint - La ruta específica de la API (ej: '/articulos').
 */
const useApiData = (endpoint) => {
  const { apiBaseUrl } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Función para forzar la recarga de datos
  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!apiBaseUrl || !endpoint) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      const fullUrl = `${apiBaseUrl}${endpoint}`;
      console.log(`Fetching data from: ${fullUrl}`);

      try {
        const response = await fetch(fullUrl);

        if (!response.ok) {
          // Intentar leer el mensaje de error del backend
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
              const errorJson = await response.json();
              errorMessage = errorJson.message || errorMessage;
          } catch {
              // Si no es JSON, usamos el error HTTP
          }
          throw new Error(errorMessage);
        }

        const json = await response.json();
        // Asumimos que el backend retorna un array o un objeto con una clave 'data' que es un array.
        setData(json.data || json); 
        
      } catch (err) {
        console.error('Error fetching API data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl, endpoint, refetchTrigger]);

  return { data, isLoading, error, refetch };
};

export default useApiData;