import { StrictMode, Suspense, 
  // useMemo
} from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import router from "./routes/routes";
import {ThemeProvider}  from './context/Context.tsx';
import {
  RouterProvider,
} from "react-router";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense>
      <ThemeProvider><RouterProvider router={router} /></ThemeProvider>
      </Suspense>
  </StrictMode>,
)
