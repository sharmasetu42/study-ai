// ============================================================
//  main.jsx
//  Application entry point.
//  Imports global CSS, then mounts <App /> into #root.
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';   // Global styles + CSS variables
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
