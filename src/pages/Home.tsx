import { Box, Avatar, Typography, IconButton, Stack, Paper} from '@mui/material';
import { GitHub, LinkedIn, Email } from '@mui/icons-material';
import TypingText from '../components/sections/TypingText';
import { floatUp } from '../components/ui/Animations';
import type { FC } from 'react';
import headshotImage from '/assets/headshot.jpg';


const Home: FC = () => {
  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Stack spacing={4} alignItems="center">
          <TypingText />

        {/* Avatar and Bio Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: '800px',
            borderRadius: 4,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            animation: `${floatUp} 0.6s ease-out 0.2s forwards`,
            opacity: 0,
          }}
        >
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4} 
            alignItems="center"
          >
            {/* Avatar */}
            <Avatar
              sx={{
                width: { xs: 200, md: 250 },
                height: { xs: 200, md: 250 },
                border: '2px solid',
                borderColor: 'primary.main',
              }}
              alt="Tyler Yang"
              src={headshotImage}
            />

            {/* Bio */}
            <Box sx={{ flex: 1, textAlign: 'left' }}>
              <Typography variant="body1" paragraph>
                I am a software engineer based out of San Francisco with a Bachelor's degree in Computer Science from the University of California, Berkeley.
                I'm currently pursuing a Master's degree in Computer Science at Georgia Tech with emphasis on AI and distributed systems. 
              </Typography>
              <Typography variant="body1" paragraph>
                Currently I am focused on backend and cloud infrastructure development for AI applications.
                I am passionate about ethical AI, agentic workflows, and distributed systems.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Social Links Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: '800px',
            borderRadius: 4,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            animation: `${floatUp} 0.6s ease-out 0.4s forwards`,
            opacity: 0,
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="center">
            <IconButton
              href="https://github.com/tylerhyang"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                  color: 'inherit',
                  backgroundColor: 'transparent'
                },
              }}
            >
              <GitHub fontSize="large" />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/in/tylerhyang/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                  color: 'inherit',
                  backgroundColor: 'transparent'
                },
              }}
            >
              <LinkedIn fontSize="large" />
            </IconButton>
            <IconButton
              href="mailto:2tyleryang@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                  color: 'inherit',
                  backgroundColor: 'transparent'
                },
              }}
            >
              <Email fontSize="large" />
            </IconButton>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Home; 