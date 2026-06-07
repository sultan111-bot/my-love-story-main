import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
// Service worker registration: src/utils/pwa-register.jsx (usePWARegister)