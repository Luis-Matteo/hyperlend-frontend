import Router from './router';
import { AppKitProvider } from './provider/AppKitProvider';

function App() {
  return (
    <AppKitProvider>
      <div className="flex">
        <Router />
      </div>
    </AppKitProvider>
  );
}

export default App;
