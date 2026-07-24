import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { LocaleProvider } from '@/i18n'
import { registerCharts } from '@/components/charts'
import { router } from './routes'
import './index.css'

// Register Chart.js components once at startup
registerCharts()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
)
