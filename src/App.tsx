import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";

const App = () => (
  <HelmetProvider>
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}
    >
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
