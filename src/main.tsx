import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RouterProvider from "./providers/RouterProvider.tsx";
import ThemeProvider from "./providers/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider />
    </ThemeProvider>
  </StrictMode>
);
