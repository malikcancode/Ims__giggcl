import "./App.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/theme/theme.jsx";
import { ServiceProvider } from "./context/api/service.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster />
    <ThemeProvider>
      <ServiceProvider>
        <App />
      </ServiceProvider>
    </ThemeProvider>
  </BrowserRouter>
);
