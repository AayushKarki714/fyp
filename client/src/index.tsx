import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./styles/globals.css";
import "./styles/tailwind.css";
import { store } from "./redux/store/store";
import { Provider } from "react-redux";
import CustomSwitch from "./components/CustomSwitch";

const queryClient = new QueryClient();
const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <CustomSwitch>
          <App />
        </CustomSwitch>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);
