import Router from './router';
import { AppKitProvider } from './provider/AppKitProvider';
import ReactGA from 'react-ga4';
import { ConfirmProvider } from './provider/ConfirmProvider';

function App() {
  ReactGA.initialize('G-Q79JWRWB61');
  return (
    <AppKitProvider>
      <ConfirmProvider>
        <Router />
      </ConfirmProvider>
    </AppKitProvider>
  );
}

export default App;
