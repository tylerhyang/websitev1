import { AppBar, Toolbar, Button, Container, Box, IconButton } from '@mui/material';
import { 
  LightMode, 
  LightModeOutlined, 
  Home, 
  Person, 
  Code, 
  Note 
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import type { FC } from 'react';

const Navbar: FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <AppBar position="fixed" color="default" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              href="/"
              startIcon={<Home />}
              sx={{ 
                '&:hover': { 
                  color: 'inherit',
                  backgroundColor: 'transparent'
                }
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              href="#about"
              startIcon={<Person />}
              sx={{ 
                '&:hover': { 
                  color: 'inherit',
                  backgroundColor: 'transparent'
                }
              }}
            >
              About
            </Button>
            <Button 
              color="inherit" 
              href="#projects"
              startIcon={<Code />}
              sx={{ 
                '&:hover': { 
                  color: 'inherit',
                  backgroundColor: 'transparent'
                }
              }}
            >
              Projects
            </Button>
            <Button 
              color="inherit" 
              href="#notes"
              startIcon={<Note />}
              sx={{ 
                '&:hover': { 
                  color: 'inherit',
                  backgroundColor: 'transparent'
                }
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