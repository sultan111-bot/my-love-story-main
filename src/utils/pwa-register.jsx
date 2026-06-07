import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function usePWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then(reg => {
      // Check update saat app buka
      reg.update();

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
            showUpdateNotification();
          }
        });
      });
    });
  }, []);

  const showUpdateNotification = () => {
    toast('✨ Update tersedia! Refresh halaman untuk update.', {
      duration: Infinity,
      action: {
        label: 'Update',
        onClick: () => window.location.reload()
      }
    });
  };

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