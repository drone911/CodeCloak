import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './routes/App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Provider } from 'react-redux';
import createStore from './configureStore'

import ErrorPage from "./error-page";

import Landing from './routes/landing';
import { landingLoader } from './routes/landing';

import Detect from './routes/detect';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        loader: landingLoader,
        element: <Landing />,
      },
      {
        path: "detect/:hash",
        element: <Detect />,
      }
    ],
  },
]);

const store = createStore();

store.subscribe(() => {
  const { uploadedFileHashes } = store.getState();

  localStorage.setItem('uploadedFileHashes', JSON.stringify(uploadedFileHashes.value));
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
