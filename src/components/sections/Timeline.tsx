import { Box, Typography, Paper } from '@mui/material';
import type { FC } from 'react';

type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: FC<TimelineProps> = ({ items }) => {
  return (
    <Box sx={{ position: 'relative', pl: 3 }}>
      {/* Vertical line */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: 'primary.main',
        }}
      />
      
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            mb: 4,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -3,
              top: 0,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'primary.main',
            },
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            {item.year}
          </Typography>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              ml: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body1">
              {item.description}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default Timeline; 