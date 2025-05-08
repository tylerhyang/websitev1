import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Notes from './pages/Notes';
import './App.css';
import type { FC } from 'react';

const App: FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Navbar />
        <main style={{ paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
