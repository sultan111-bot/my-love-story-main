import { useCallback } from "react";

/**
 * Hook untuk vibration menggunakan Navigator.vibrate API
 */
export function useVibration() {
  const vibrate = useCallback((pattern) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const vibrateClick = useCallback(() => {
    vibrate(10); // Short vibration for click
  }, [vibrate]);

  const vibrateSuccess = useCallback(() => {
    vibrate([50, 50, 50]); // Pattern for success
  }, [vibrate]);

  const vibrateError = useCallback(() => {
    vibrate([30, 50, 30]); // Pattern for error
  }, [vibrate]);

  const vibrateHeartbeat = useCallback(() => {
    vibrate([50, 100, 50]); // Pattern for heartbeat
  }, [vibrate]);

  const vibratePop = useCallback(() => {
    vibrate(20); // Short pop vibration
  }, [vibrate]);

  return {
    vibrate,
    vibrateClick,
    vibrateSuccess,
    vibrateError,
    vibrateHeartbeat,
    vibratePop,
  };
}
