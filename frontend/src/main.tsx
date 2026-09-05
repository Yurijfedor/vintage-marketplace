import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./app/global.css";
import App from "./App.tsx";
import { FavoritesProvider } from "./features/favorites/FavoritesProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </StrictMode>,
);
