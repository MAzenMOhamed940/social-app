import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './Routing/AppRouter/AppRouter'
import AuthUserContext from './Context/AuthUserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
export const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
          <AuthUserContext>
      <RouterProvider router={router}/>
    </AuthUserContext>
    </QueryClientProvider>

  </StrictMode>,
)
