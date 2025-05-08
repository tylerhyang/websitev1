import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import type { FC } from 'react';

const TypingText: FC = () => {
  const [text, setText] = useState('');
  const fullText = "Hi, I'm Tyler";
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100); // Speed of typing

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
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