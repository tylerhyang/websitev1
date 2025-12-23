import { Box, Typography } from '@mui/material';
import { useState, useRef } from 'react';
import type { FC } from 'react';
import ReactCardFlip from 'react-card-flip';
import { keyframes } from '@mui/material';

type ImageItem = {
  frontImage: string;
  backText: string;
  title: string;
  date?: string;
  location?: string;
};

interface FlipCardGridProps {
  images: ImageItem[];
}

const FlipCardGrid: FC<FlipCardGridProps> = ({ images }) => {
  const [flippedCards, setFlippedCards] = useState<boolean[]>(Array(4).fill(false));
  const [flippingCards, setFlippingCards] = useState<boolean[]>(Array(4).fill(false));
  const hoverStates = useRef<boolean[]>(Array(4).fill(false));

  const handleCardHover = (index: number, isHovering: boolean) => {
    // Update the hover state
    hoverStates.current[index] = isHovering;
    
    // Don't start a new flip if one is already in progress
    if (flippingCards[index]) {
      return;
    }

    setFlippingCards(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });

    setFlippedCards(prev => {
      const newState = [...prev];
      newState[index] = isHovering;
      return newState;
    });

    // Reset the flipping state after the animation completes
    setTimeout(() => {
      setFlippingCards(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
      
      // Check if the hover state has changed during the animation
      // and update the flip state accordingly
      if (hoverStates.current[index] !== isHovering) {
        setFlippedCards(prev => {
          const newState = [...prev];
          newState[index] = hoverStates.current[index];
          return newState;
        });
      }
    }, 600); // Match the flipSpeedBackToFront/flipSpeedFrontToBack duration
  };

  // Random rotations for each card
  const rotations = [
    { rotate: '-3deg', translateX: '-10px' },
    { rotate: '2deg', translateX: '5px' },
    { rotate: '-1deg', translateX: '-5px' },
    { rotate: '3deg', translateX: '10px' },
  ];

  // Create custom float up animation for each card
  const createFloatUpAnimation = (index: number) => keyframes`
    from {
      opacity: 0;
      transform: translateY(20px) rotate(${rotations[index].rotate}) translateX(${rotations[index].translateX});
    }
    to {
      opacity: 1;
      transform: translateY(0) rotate(${rotations[index].rotate}) translateX(${rotations[index].translateX});
    }
  `;

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      pb: 2,
      position: 'relative',
      overflow: 'visible', // Allow overflow during flip animation
    }}>
      <Box sx={{
        display: 'flex',
        gap: -2,
        position: 'relative',
        justifyContent: 'center',
        width: 'fit-content',
        margin: '0 auto',
        padding: '20px', // Add padding to accommodate rotated cards and flip animation
        overflow: 'visible', // Allow overflow during flip
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
              overflow: 'visible', // Allow overflow during flip animation
              animation: `${createFloatUpAnimation(index)} 1s ease-out ${index * 0.2}s forwards`,
              opacity: 0,
            }}
          >
            <Box sx={{
              width: '100%',
              height: '100%',
              overflow: 'visible', // Remove clipping during flip
              position: 'relative',
            }}>
              <ReactCardFlip
                isFlipped={flippedCards[index]}
                flipDirection="horizontal"
                flipSpeedBackToFront={0.6}
                flipSpeedFrontToBack={0.6}
                containerStyle={{ 
                  width: '100%', 
                  height: '100%', 
                  overflow: 'visible', // Allow overflow during 3D flip
                  position: 'relative',
                }}
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
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 3,
                  boxShadow: 3,
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                }}
              >
                {/* Date section */}
                {item.date && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item.date}
                  </Typography>
                )}
                
                {/* Body content */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    fontSize: '0.875rem',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.backText}
                </Typography>
                
                {/* Location section */}
                {item.location && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item.location}
                  </Typography>
                )}
              </Box>
            </ReactCardFlip>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FlipCardGrid; 