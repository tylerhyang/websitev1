import { Box, Typography, Paper, Stack, Link } from '@mui/material';
import type { FC } from 'react';

type TimelineItem = {
  year: string;
  company: string;
  title: string;
  description: string;
  companyUrl?: string;
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
            mb: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -3,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'primary.main',
            },
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              ml: 2,
              backgroundColor: 'background.paper',
              transition: 'all 0.3s ease',
              borderRadius: '12px',
              '&:hover': {
                transform: 'translateX(8px)',
                boxShadow: 4,
                backgroundColor: 'action.hover',
                cursor: 'pointer'
              }
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.companyUrl ? (
                  <Link
                    href={item.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {item.company}
                  </Link>
                ) : (
                  <Typography color="inherit" sx={{fontWeight: 500 }}>
                    {item.company}
                  </Typography>
                )}
                <Typography color="inherit"sx={{fontWeight: 500 }}>
                  {item.year}
                </Typography>
              </Box>
              <Typography 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.9rem', 
                  textAlign: 'left'
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{ 
                  fontSize: '0.85rem', 
                  textAlign: 'left'
                }}>
                {item.description}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default Timeline; 