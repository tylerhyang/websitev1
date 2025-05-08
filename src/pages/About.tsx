import { Box, Typography, Container, Stack, Paper, keyframes } from '@mui/material';
import ImageCarousel from '../components/sections/ImageCarousel';
import Timeline from '../components/sections/Timeline';
import type { FC } from 'react';

const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

const About: FC = () => {
  const images = [
    {
      frontImage: '/path-to-image1.jpg',
      backText: 'Description for image 1',
      title: 'Image 1'
    },
    // Add more images as needed
  ];

  const timelineItems: TimelineItem[] = [
    {
      year: '2023',
      title: 'Software Engineer',
      description: 'Working on exciting projects...'
    },
    {
      year: '2023',
      title: 'Software Engineer',
      description: 'Working on exciting projects...'
    },
    {
      year: '2023',
      title: 'Software Engineer',
      description: 'Working on exciting projects...'
    },
    {
      year: '2023',
      title: 'Software Engineer',
      description: 'Working on exciting projects...'
    },
    // Add more timeline items as needed
  ];

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
            About
          </Typography>
          <Typography sx={{ fontWeight: 700 }} color="text.secondary">
            Who I am
          </Typography>
        </Box>

        {/* Image Carousel Section */}
        <Paper elevation={3} sx={{ 
          p: 4,
          animation: `${floatUp} 0.6s ease-out 0.4s forwards`,
          opacity: 0
        }}>
          <Box>
            <ImageCarousel images={images} />
          </Box>
        </Paper>

        {/* Timeline Section */}
        <Box sx={{ 
          animation: `${floatUp} 0.6s ease-out 0.6s forwards`,
          opacity: 0
        }}>
          <Typography variant="h4" gutterBottom>
            Professional Journey
          </Typography>
          <Timeline items={timelineItems} />
        </Box>
      </Stack>
    </Box>
  );
};

export default About; 