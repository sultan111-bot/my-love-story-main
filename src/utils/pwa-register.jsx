import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function usePWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const showUpdateNotification = useCallback(() => {
    toast('✨ Update tersedia! Refresh halaman untuk update.', {
      duration: Infinity,
      action: {
        label: 'Update',
        onClick: () => window.location.reload(),
      },
    });
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

    let updateInterval;

    const onUpdateFound = (reg) => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setUpdateAvailable(true);
          showUpdateNotification();
        }
      });
    };

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
        console.log('✅ Service Worker registered');

        onUpdateFound(reg);
        reg.addEventListener('updatefound', () => onUpdateFound(reg));
        await reg.update();
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
      navigator.serviceWorker.ready.then((reg) => reg.update()).catch(() => {});
    }, 60 * 60 * 1000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker.ready.then((reg) => reg.update()).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }

    return () => {
      clearInterval(updateInterval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [showUpdateNotification]);

  return { updateAvailable };
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('🎉 Aplikasi terinstall!');
      }
      setInstallPrompt(null);
    }
  };

  return { isInstallable, installApp };
}
