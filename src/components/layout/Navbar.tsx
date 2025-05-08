import { AppBar, Toolbar, Button, Container, Box, IconButton } from '@mui/material';
import { LightMode, LightModeOutlined} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import type { FC } from 'react';

const Navbar: FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <AppBar position="fixed" color="default" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button color="inherit" href="/">Home</Button>
            <Button color="inherit" href="#about">About</Button>
            <Button color="inherit" href="#projects">Projects</Button>
            <Button color="inherit" href="#notes">Notes</Button>
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