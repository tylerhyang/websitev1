import { Box, Typography, Stack, Paper, keyframes } from '@mui/material';
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
  company: string;
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
      year: '2025 - Present',
      company: 'Georgia Institute of Technology',
      title: 'M.S. Computer Science',
      description: 'Concentration: Computing Systems'
    },
    {
      year: '2025 - Present',
      company: 'Glean',
      title: 'Software Engineer',
      description: 'Enterprise search infrastructure'
    },
    {
      year: '2023 - 2025',
      company: 'Cloudera',
      title: 'Software Engineer II - AI Inference',
      description: 'Model serving infrastructure on KServe'
    },
    {
      year: '2019 -2023',
      company: 'University of California, Berkeley',
      title: 'B.A. Computer Science',
      description: 'GPA: 3.9/4'
    },
    {
      year: '2022 - 2022',
      company: 'Cloudera',
      title: 'Software Engineer Intern - Machine Learning',
      description: 'Kubernetes operators for AI Workloads'
    },
    {
      year: '2021 - 2021',
      company: 'University of California, Berkeley',
      title: 'Undergraduate Researcher',
      description: 'Pipeline load balancing and graph search heuristics'
    },
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
        <Box sx={{ 
          textAlign: 'left',
          animation: `${floatUp} 0.6s ease-out 0.2s forwards`,
          opacity: 0
        }}>
          <Typography gutterBottom sx={{ fontWeight: 500, fontSize: '1.3rem' }}>
            Timeline
          </Typography>
        </Box>
          <Timeline items={timelineItems} />
        </Box>
      </Stack>
    </Box>
  );
};

export default About; 