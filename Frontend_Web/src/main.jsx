import React from 'react'
import ReactDOM from 'react-dom/client'
// import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "react-hot-toast";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId="395832852196-dmo7tvcbi8acsutcf7s7a2cpcqv21298.apps.googleusercontent.com"> */}
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>,
)
