// src/hooks/useBackground.ts
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { DashboardBackground } from '../types';
import { useLocalStorage } from './useLocalStorage';

// Hook para gerenciar o fundo do dashboard
export const useBackground = () => {
  const [background, setBackground] = useState<DashboardBackground>({ 
    type: 'color', 
    value: '#D9E4EC' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Usar localStorage para carregamento instantâneo
  const [localBackground, setLocalBackground] = useLocalStorage<DashboardBackground>(
    'dashboard_background',
    { type: 'color', value: '#D9E4EC' }
  );

  // Carregar fundo do servidor ao inicializar
  useEffect(() => {
    const fetchBackground = async () => {
      setLoading(true);
      try {
        const { data, error } = await userService.getUserBackground();
        if (error) {
          setError(error);
          return;
        }
        
        if (data) {
          setBackground(data);
          // Atualizar também no localStorage
          setLocalBackground(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar fundo'));
      } finally {
        setLoading(false);
      }
    };

    fetchBackground();
  }, []);

  // Função para atualizar o fundo
  const updateBackground = async (newBackground: DashboardBackground) => {
    setLoading(true);
    setError(null);
    
    try {
      // Atualizar imediatamente no localStorage para feedback instantâneo
      setLocalBackground(newBackground);
      setBackground(newBackground);
      
      // Enviar para o servidor
      const { error } = await userService.updateUserBackground(newBackground);
      
      if (error) {
        setError(error);
        // Reverter para o valor anterior em caso de erro
        setBackground(background);
        setLocalBackground(background);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar fundo'));
      // Reverter para o valor anterior em caso de erro
      setBackground(background);
      setLocalBackground(background);
    } finally {
      setLoading(false);
    }
  };

  return {
    background: localBackground, // Usar o valor do localStorage para feedback instantâneo
    updateBackground,
    loading,
    error
  };
};

export default useBackground;