import { usePWAInstall } from '@/utils/pwa-register';
import { toast } from 'sonner';

export function PWAHeader() {
  const { isInstallable, installApp } = usePWAInstall();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 border-b border-pink-200">
      <div className="flex items-center gap-2">
        <div className="text-2xl">💕</div>
        <div>
          <h1 className="font-bold text-pink-900">A Gift For You</h1>
          <p className="text-xs text-pink-700">Happy Birthday!</p>
        </div>
      </div>

      {isInstallable && (
        <button
          onClick={installApp}
          className="px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg font-medium text-sm"
        >
          📱 Install
        </button>
      )}
    </div>
  );
}

export default PWAHeader;