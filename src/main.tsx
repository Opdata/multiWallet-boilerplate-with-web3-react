import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import ProviderExample from './components/ProviderExample';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ProviderExample>
      <App />
    </ProviderExample>
  </React.StrictMode>
);
