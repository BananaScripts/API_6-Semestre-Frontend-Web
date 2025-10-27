import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/akasys.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Apply saved theme or default to dark (AKASYS prefers dark mode)
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
} else {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
