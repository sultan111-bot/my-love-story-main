import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker dengan auto update
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('✨ Update tersedia! Refresh untuk mendapatkan versi terbaru.');
    // Opsional: Tampilkan prompt ke user
    if (confirm('Update tersedia! Muat ulang untuk mendapatkan fitur terbaru?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('✅ Aplikasi siap untuk offline!');
  },
  onRegisteredSW(swUrl, registration) {
    console.log('✅ Service Worker terdaftar:', swUrl);
  },
  onRegisterError(error) {
    console.error('❌ Gagal mendaftarkan Service Worker:', error);
  }
});

createRoot(document.getElementById("root")).render(<App />);