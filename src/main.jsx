import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Redux
import { Provider } from "react-redux";
import store from "./app/store";

// Router
import { RouterProvider } from 'react-router-dom';
import router from "./router";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
