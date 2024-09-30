import Router from "./router";
import { AppKitProvider } from "./provider/AppKitProvider";
import ReactGA from "react-ga4";

function App() {
  ReactGA.initialize("G-Q79JWRWB61");
  return (
    <AppKitProvider>
      <div className="flex">
        <Router />
      </div>
    </AppKitProvider>
  );
}

export default App;
