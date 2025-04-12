import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ProductPage from './pages/ProductPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductPage />
  </StrictMode>,
)
