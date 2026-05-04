import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { APP_CONFIG } from '../constants';

export function useConfig() {
  const [config, setConfig] = useState({
    phoneNumber: '+91 92424 86642',
    email: APP_CONFIG.social.gmail,
    address: 'HQ CMDT, Sector 7, India',
    facebookUrl: APP_CONFIG.social.facebookPage,
    instagramUrl: APP_CONFIG.social.facebookGroup,
    twitterUrl: '#'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const settings = await firebaseService.getDoc('settings', 'global_config');
        if (settings) {
          setConfig(prev => ({ ...prev, ...settings }));
        }
      } catch (err) {
        console.error('Error loading config:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  return { config, loading };
}
