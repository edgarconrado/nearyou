// hooks/useWarmUpBrowser.ts
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Precalienta el navegador cuando el componente se monta
    void WebBrowser.warmUpAsync();
    
    // Limpia cuando el componente se desmonta
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};