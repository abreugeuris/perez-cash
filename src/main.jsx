import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux'; // ← faltaba
import { store } from './store/index';
import { CookiesProvider } from 'react-cookie';
import App from '@/App';
import GlobalStyle from '@/styles/GlobalStyle';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReduxProvider store={store}> 
      <CookiesProvider>
        <BrowserRouter>
          <GlobalStyle />
          <App />
        </BrowserRouter>
      </CookiesProvider>
    </ReduxProvider>
  </React.StrictMode>
);