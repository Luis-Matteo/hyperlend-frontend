import Router from './router';
import { AppKitProvider } from './provider/AppKitProvider';
import ReactGA from 'react-ga4';
import { ToastProvider } from './provider/ToastProvider';
import { BrowserRouter } from 'react-router-dom';
import { ConfirmProvider } from './provider/ConfirmProvider';

function App() {
  ReactGA.initialize('G-Q79JWRWB61');
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
