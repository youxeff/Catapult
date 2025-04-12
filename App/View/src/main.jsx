import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProductPage from './pages/ProductPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductPage />
  </StrictMode>,
)
