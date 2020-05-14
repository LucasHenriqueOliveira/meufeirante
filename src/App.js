import React from 'react';
import { SnackbarProvider } from 'notistack';
import './global.css';
import Routes from './routes';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Routes />    
    </SnackbarProvider>
  );
}

export default App;
