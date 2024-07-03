import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = 'https://github.com/Zinda-Lukman/ton_first_frontend/blob/master/manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
 
 <React.StrictMode>
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
  </React.StrictMode>,
)
