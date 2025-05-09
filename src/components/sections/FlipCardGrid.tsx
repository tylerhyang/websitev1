import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import type { FC } from 'react';
import ReactCardFlip from 'react-card-flip';

type ImageItem = {
  frontImage: string;
  backText: string;
  title: string;
};

interface FlipCardGridProps {
  images: ImageItem[];
}

const FlipCardGrid: FC<FlipCardGridProps> = ({ images }) => {
  const [flippedCards, setFlippedCards] = useState<boolean[]>(Array(4).fill(false));

  const handleCardHover = (index: number, isHovering: boolean) => {
    setFlippedCards(prev => {
      const newState = [...prev];
      newState[index] = isHovering;
      return newState;
    });
  };

  // Random rotations for each card
  const rotations = [
    { rotate: '-3deg', translateX: '-10px' },
    { rotate: '2deg', translateX: '5px' },
    { rotate: '-1deg', translateX: '-5px' },
    { rotate: '3deg', translateX: '10px' },
  ];

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      pb: 2,
      position: 'relative',
    }}>
      <Box sx={{
        display: 'flex',
        gap: -2,
        position: 'relative',
        justifyContent: 'center',
        width: 'fit-content',
        margin: '0 auto',
        '& > *': {
          position: 'relative',
          zIndex: 1,
          '&:hover': {
            zIndex: 2,
          },
        },
      }}>
        {images.slice(0, 4).map((item, index) => (
          <Box 
            key={index}
            sx={{
              flex: '0 0 250px',
              aspectRatio: '1/1',
              transform: `rotate(${rotations[index].rotate}) translateX(${rotations[index].translateX})`,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: `rotate(0deg) translateX(0)`,
              },
              overflow: 'hidden',
            }}
          >
            <ReactCardFlip
              isFlipped={flippedCards[index]}
              flipDirection="horizontal"
              flipSpeedBackToFront={0.6}
              flipSpeedFrontToBack={0.6}
              containerStyle={{ width: '100%', height: '100%' }}
            >
              {/* Front of card */}
              <Box
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                component="img"
                src={item.frontImage}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: 2,
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  boxShadow: 3,
                }}
              />
              {/* Back of card */}
              <Box
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  boxShadow: 3,
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    textAlign: 'center',
                  }}
                >
                  {item.backText}
                </Typography>
              </Box>
            </ReactCardFlip>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FlipCardGrid; 