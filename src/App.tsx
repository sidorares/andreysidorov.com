import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";

const App = () => (
  <BrowserRouter
    basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}
  >
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </BrowserRouter>
);

export default App;
