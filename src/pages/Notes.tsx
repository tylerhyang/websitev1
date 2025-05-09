import { Box, Typography, Stack } from '@mui/material';
import { floatUp } from '../components/ui/Animations';
import type { FC } from 'react';

const Notes: FC = () => {
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
            Notes
          </Typography>
          <Typography sx={{ fontWeight: 700 }} color="text.secondary">
            As a current master's student, I am tracking the classes I'm taking here and the corresponding notes I have collected.
            Notes are password protected for academic integrity reasons.
            Please reach out to me if you would like access.
          </Typography>
        </Box>
        </Stack>
    </Box>
  );
};

export default Notes; 