import { Typography, Box } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

const TypingText: FC = () => {
  const [text, setText] = useState('');
  const fullText = "Hi, I'm Tyler";
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      timeoutRef.current = setTimeout(() => {
        setText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 70);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [currentIndex, fullText]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        position: 'relative',
      }}
    >
      {/* Visible typing text */}
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: 400,
          color: 'text.primary',
          whiteSpace: 'nowrap',
          willChange: 'contents',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          '&::after': {
            content: '""',
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: 'text.primary',
            marginLeft: '4px',
            marginBottom: '0.1em',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          },
          '@keyframes blink': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0 },
          },
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default TypingText; 