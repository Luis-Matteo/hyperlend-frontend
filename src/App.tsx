import Router from './router';
import { AppKitProvider } from './provider/AppKitProvider';
import ReactGA from 'react-ga4';
import { ConfirmProvider } from './provider/ConfirmProvider';
import { ToastProvider } from './provider/ToastProvider';

function App() {
  ReactGA.initialize('G-Q79JWRWB61');
  return (
    <AppKitProvider>
      <ConfirmProvider>
        <ToastProvider>
          <Router />
        </ToastProvider>
      </ConfirmProvider>
    </AppKitProvider>
  );
}

export default App;
