import { useCallback, useEffect, useState, useRef } from 'react';

export function usePWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const registrationRef = useRef(null);

  const showUpdateNotification = useCallback(() => {
    console.log('✨ Update tersedia! Refresh halaman untuk update.');
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

    let updateInterval;
    let isMounted = true;

    const onUpdateFound = (reg) => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          if (isMounted) {
            setUpdateAvailable(true);
            showUpdateNotification();
          }
        }
      });
    };

    const registerSW = async () => {
      if (registrationRef.current) {
        console.log('ℹ️ Service Worker sudah terdaftar');
        return;
      }

      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
        registrationRef.current = reg;
        console.log('✅ Service Worker registered');

        onUpdateFound(reg);
        reg.addEventListener('updatefound', () => onUpdateFound(reg));
        
        try {
          await reg.update();
        } catch (updateError) {
          console.warn('⚠️ SW update check failed:', updateError);
        }
      } catch (err) {
        console.error('❌ SW registration failed:', err);
      }
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW, { once: true });
    }

    updateInterval = setInterval(() => {
      navigator.serviceWorker.ready
        .then((reg) => {
          return reg.update();
        })
        .catch((err) => {
          console.warn('⚠️ Periodic SW update failed:', err);
        });
    }, 60 * 60 * 1000);

    const onVisible = () => {
      if (document.visibilityState === 'visible' && isMounted) {
        navigator.serviceWorker.ready
          .then((reg) => reg.update())
          .catch((err) => {
            console.warn('⚠️ Visibility update failed:', err);
          });
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    if (navigator.storage?.persist) {
      navigator.storage.persist()
        .then((persisted) => {
          if (persisted) {
            console.log('✅ Storage persisted');
          } else {
            console.warn('⚠️ Storage persistence not available');
          }
        })
        .catch((err) => {
          console.warn('⚠️ Storage persist failed:', err);
        });
    }

    return () => {
      isMounted = false;
      clearInterval(updateInterval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [showUpdateNotification]);

  return { updateAvailable };
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const promptRef = useRef(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      promptRef.current = e;
      setInstallPrompt(e);
      setIsInstallable(true);
      console.log('✅ Install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      console.log('✅ App installed successfully');
      setInstallPrompt(null);
      promptRef.current = null;
      setIsInstallable(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    const prompt = promptRef.current || installPrompt;
    
    if (!prompt) {
      console.warn('⚠️ Install prompt not available');
      return;
    }

    try {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('🎉 Aplikasi terinstall!');
        console.log('✅ User accepted install');
      } else {
        console.log('ℹ️ User dismissed install');
      }
      
      setInstallPrompt(null);
      promptRef.current = null;
    } catch (error) {
      console.error('❌ Install failed:', error);
    }
  };

  return { isInstallable, installApp };
}
