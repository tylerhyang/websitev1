import { Typography, Box, Stack } from '@mui/material';
import type { FC } from 'react';
import { floatUp } from '../components/ui/animations';

const Projects: FC = () => {
  return (
    <Box sx={{ 
      px: 3, 
      py: 4, 
      width: '60vw'
    }}>
      <Stack direction="column" spacing={4}>
        <Box sx={{ 
          textAlign: 'left',
          animation: `${floatUp} 0.6s ease-out 0.2s forwards`,
          opacity: 0
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            Projects
          </Typography>
          <Typography sx={{ fontWeight: 700 }} color="text.secondary">
            What I'm working on
          </Typography>
        </Box>
        </Stack>
    </Box>
  );
};

export default Projects; 