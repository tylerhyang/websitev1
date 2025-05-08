import { Box, Card, CardMedia, Typography, IconButton, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import type { FC } from 'react';

type ImageItem = {
  frontImage: string;
  backText: string;
  title: string;
};

interface ImageCarouselProps {
  images: ImageItem[];
}

const ImageCarousel: FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Previous Button */}
        <IconButton
          onClick={handlePrevious}
          sx={{
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Carousel */}
        <Box sx={{ flex: 1, height: '400px' }}>
          <Card
            sx={{
              position: 'relative',
              height: '100%',
              overflow: 'hidden',
              '&:hover .overlay': {
                opacity: 1,
              },
            }}
          >
            {/* Image */}
            <CardMedia
              component="img"
              image={images[currentIndex].frontImage}
              alt={images[currentIndex].title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Overlay */}
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease-in-out',
                p: 3,
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                {images[currentIndex].backText}
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Next Button */}
        <IconButton
          onClick={handleNext}
          sx={{
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Stack>

      {/* Dots Navigation */}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        sx={{ mt: 2 }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? 'primary.main' : 'action.disabled',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ImageCarousel; 