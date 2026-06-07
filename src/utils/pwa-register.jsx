import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

export function usePWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const registrationRef = useRef(null); // ✅ Track registration to prevent duplicates

  const showUpdateNotification = useCallback(() => {
    toast('✨ Update tersedia! Refresh halaman untuk update.', {
      duration: Infinity,
      action: {
        label: 'Update',
        onClick: () => {
          window.location.reload();
        },
      },
    });
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

    let updateInterval;
    let isMounted = true; // ✅ Track component mount status

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
      // ✅ IMPROVED: Check if already registered
      if (registrationRef.current) {
        console.log('ℹ️ Service Worker sudah terdaftar');
        return;
      }

      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
        registrationRef.current = reg; // ✅ Store reference
        console.log('✅ Service Worker registered');

        onUpdateFound(reg);
        reg.addEventListener('updatefound', () => onUpdateFound(reg));
        
        // ✅ Update check dengan error handling
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

    // ✅ IMPROVED: Periodic update check dengan better error handling
    updateInterval = setInterval(() => {
      navigator.serviceWorker.ready
        .then((reg) => {
          return reg.update();
        })
        .catch((err) => {
          console.warn('⚠️ Periodic SW update failed:', err);
        });
    }, 60 * 60 * 1000); // 1 hour

    // ✅ IMPROVED: Check on visibility change dengan safety checks
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

    // ✅ IMPROVED: Persist storage dengan error handling
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
      isMounted = false; // ✅ Cleanup flag
      clearInterval(updateInterval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [showUpdateNotification]);

  return { updateAvailable };
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const promptRef = useRef(null); // ✅ Store prompt reference

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      promptRef.current = e; // ✅ Store untuk later use
      setInstallPrompt(e);
      setIsInstallable(true);
      console.log('✅ Install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // ✅ IMPROVED: Listen for app installed event
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
        toast.success('🎉 Aplikasi terinstall!');
        console.log('✅ User accepted install');
      } else {
        console.log('ℹ️ User dismissed install');
      }
      
      setInstallPrompt(null);
      promptRef.current = null;
    } catch (error) {
      console.error('❌ Install failed:', error);
      toast.error('Instalasi gagal');
    }
  };

  return { isInstallable, installApp };
}