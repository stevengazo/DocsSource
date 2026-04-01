import { useState } from 'react'
import AppRouter from './router/AppRouter'
import { ThemeProvider } from './context/ThemeContext'
import { DocumentsProvider } from './context/DocumentsContext'

function App() {

  return (
    <>
      <ThemeProvider>
        <DocumentsProvider>
          <AppRouter />
        </DocumentsProvider>
      </ThemeProvider>
    </>
  )
}

export default App
