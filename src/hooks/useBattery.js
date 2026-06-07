import { useEffect, useState } from "react";

export function useBattery() {
  const [info, setInfo] = useState({ supported: null, level: null });

  useEffect(() => {
    let battery;
    let mounted = true;
    const onChange = () => {
      if (battery && mounted) setInfo({ supported: true, level: battery.level });
    };
    if (typeof navigator !== "undefined" && navigator.getBattery) {
      navigator
        .getBattery()
        .then((b) => {
          battery = b;
          if (!mounted) return;
          setInfo({ supported: true, level: b.level });
          b.addEventListener("levelchange", onChange);
        })
        .catch(() => mounted && setInfo({ supported: false, level: null }));
    } else {
      setInfo({ supported: false, level: null });
    }
    return () => {
      mounted = false;
      if (battery) battery.removeEventListener("levelchange", onChange);
    };
  }, []);

  return info;
}
