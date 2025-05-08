import { Box, Typography, Container } from '@mui/material';
import ImageCarousel from '../components/sections/ImageCarousel';
import Timeline from '../components/sections/Timeline';
import type { FC } from 'react';

const About: FC = () => {
  const images = [
    {
      frontImage: '/path-to-image1.jpg',
      backText: 'Description for image 1',
      title: 'Image 1'
    },
    // Add more images as needed
  ];

  const timelineItems = [
    {
      year: '2023',
      title: 'Software Engineer',
      description: 'Working on exciting projects...'
    },
    {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="h4" color="text.secondary">
          Who I am
        </Typography>
      </Box>

      {/* Image Carousel Section */}
      <Box sx={{ mb: 6 }}>
        <ImageCarousel images={images} />
      </Box>

      {/* Timeline Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Professional Journey
        </Typography>
        <Timeline items={timelineItems} />
      </Box>
    </Container>
  );
};

export default About; 