import Router from './router';
import { AppKitProvider } from './provider/AppKitProvider';
import ReactGA from 'react-ga4';
import { ToastProvider } from './provider/ToastProvider';
import { BrowserRouter } from 'react-router-dom';
import { ConfirmProvider } from './provider/ConfirmProvider';
import * as Sentry from "@sentry/react";

function App() {
  ReactGA.initialize('G-Q79JWRWB61');
  Sentry.init({
    dsn: "https://6c404398d0da45a40871ade590d6c19f@o4508513839939584.ingest.de.sentry.io/4508513842692176",
    integrations: [],
  });

  return (
    <AppKitProvider>
      <ToastProvider>
        <BrowserRouter>
          <ConfirmProvider>
            <Router />
          </ConfirmProvider>
        </BrowserRouter>
      </ToastProvider>
    </AppKitProvider>
  );
}

export default App;
