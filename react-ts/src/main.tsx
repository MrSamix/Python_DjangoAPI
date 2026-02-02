import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { store } from './store/index.ts'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import APP_ENV from './env/index.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID_OAUTH_GOOGLE}>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </GoogleOAuthProvider>
    
  </Provider>,
)
