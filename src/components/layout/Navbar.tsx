import { AppBar, Toolbar, Button, Container, Box, IconButton } from '@mui/material';
import { 
  LightMode, 
  LightModeOutlined, 
  HomeOutlined, 
  PersonOutlined, 
  Code, 
  EditNoteOutlined 
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
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
              component={RouterLink}
              to="/"
              startIcon={<HomeOutlined />}
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
              component={RouterLink}
              to="/about"
              startIcon={<PersonOutlined />}
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
              component={RouterLink}
              to="/projects"
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
              component={RouterLink}
              to="/notes"
              startIcon={<EditNoteOutlined />}
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