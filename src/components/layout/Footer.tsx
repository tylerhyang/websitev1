import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box sx={{ py: 2, textAlign: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
    <Typography variant="body2">
      © {new Date().getFullYear()} Tyler Yang. All rights reserved.
    </Typography>
  </Box>
);

export default Footer; 