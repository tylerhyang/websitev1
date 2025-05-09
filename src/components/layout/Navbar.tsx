import { AppBar, Toolbar, Button, Container, Box, IconButton } from '@mui/material';
import { 
  LightMode, 
  LightModeOutlined, 
  HomeOutlined, 
  PersonOutlined, 
  Code, 
  EditNoteOutlined
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import type { FC } from 'react';

const Navbar: FC = () => {
  const { toggleTheme, isDarkMode } = useCustomTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="fixed" color="default" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={RouterLink}
              to="/"
              startIcon={<HomeOutlined />}
              sx={{ 
                '&:hover': { 
                  color: 'inherit',
                  backgroundColor: 'transparent'
                },
                boxShadow: isActive('/') ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px',
                padding: '6px 16px'
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink}
              to="/about"
              startIcon={<PersonOutlined />}
              sx={{ 
                '&:hover': { 
                  color: 'inherit',
                  backgroundColor: 'transparent'
                },
                boxShadow: isActive('/about') ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px',
                padding: '6px 16px'
              }}
            >
              About
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink}
              to="/projects"
              startIcon={<Code />}
              sx={{ 
                '&:hover': { 
                  color: 'inherit',
                  backgroundColor: 'transparent'
                },
                boxShadow: isActive('/projects') ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px',
                padding: '6px 16px'
              }}
            >
              Projects
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink}
              to="/notes"
              startIcon={<EditNoteOutlined />}
              sx={{ 
                '&:hover': { 
                  color: 'inherit',
                  backgroundColor: 'transparent'
                },
                boxShadow: isActive('/notes') ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px',
                padding: '6px 16px'
              }}
            >
              Notes
            </Button>
          </Box>
          <IconButton 
            onClick={toggleTheme} 
            color="inherit"
            sx={{
              '&:focus': {
                outline: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
              },
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            {isDarkMode ? <LightModeOutlined /> : <LightMode />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 