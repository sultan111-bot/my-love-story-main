import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);

// Register service worker untuk PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => {
        console.log('✅ Service Worker registered:', reg);
        
        // Check for updates setiap 1 jam
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000);

        // Check update ketika user fokus ke tab
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            reg.update();
          }
        });
      })
      .catch(err => {
        console.error('❌ SW registration failed:', err);
      });
  });
}