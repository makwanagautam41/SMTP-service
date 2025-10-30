// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ApiKeyProvider } from "./context/ApiKeyContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppCredentialsProvider } from "./context/AppCredentialsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ApiKeyProvider>
        <ThemeProvider>
          <AppCredentialsProvider>
            <App />
          </AppCredentialsProvider>
        </ThemeProvider>
      </ApiKeyProvider>
    </AuthProvider>
  </BrowserRouter>
);
