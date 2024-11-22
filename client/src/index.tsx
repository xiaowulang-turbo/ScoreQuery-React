import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
import Table from './table';
import './index.css';
import AppRoutes from './routes';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <AppRoutes />
  // <Provider store={store}>
  //   <BrowserRouter>
  //     <Table />
  //   </BrowserRouter>
  // </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
