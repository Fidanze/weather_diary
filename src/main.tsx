import { ApiProvider } from "@reduxjs/toolkit/query/react";
import 'primeicons/primeicons.css';
import { addLocale, locale, PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-dark-green/theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { apiSlice } from "./api/apiSlice";
import App from './App.tsx';
import ruLocale from './assets/locale.json';
import './index.scss';


addLocale('ru', ruLocale)
locale('ru')

async function enableMocking() {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./test/browser");

    return worker.start();
  }
}
const rootElement = createRoot(document.getElementById("root")!);

enableMocking().then(() => {
  rootElement.render(
    <StrictMode>
      <ApiProvider api={apiSlice}>
        <PrimeReactProvider value={{ locale: 'ru' }}>
          <App />
        </PrimeReactProvider>
      </ApiProvider>
    </StrictMode >,
  );
});
