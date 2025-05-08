import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Navbar />
      <main style={{ paddingTop: '64px' }}>
        {/* Content will go here */}
      </main>
    </ThemeProvider>
  );
}

export default App;
