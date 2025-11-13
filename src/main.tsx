import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
//setup
import "./modules/settings/services/settings.ts";
import "./dayjs.ts";

// Регистрируем Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/cooking/sw.js");
  });
}

createRoot(document.getElementById("root")!).render(
  <HeroUIProvider className="h-full">
    <App />
    <ToastProvider />
  </HeroUIProvider>
);
