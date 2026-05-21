import { useEffect } from 'react';
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { useAuthStore } from "./features/auth/store/auth.store";

function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <RouterProvider router={router} />;
}

export default App;
