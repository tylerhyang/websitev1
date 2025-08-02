import { Box, Typography, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { floatUp } from '../components/ui/Animations';
import type { FC } from 'react';

type NoteItem = {
  course: string;
  notes: string;
  status: 'completed' | 'in-progress' | 'scheduled';
};

const Notes: FC = () => {
  const notesData: NoteItem[] = [
    {
      course: 'TBD',
      notes: 'TBD',
      status: 'in-progress'
    }
  ];

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Chip 
            label="Completed" 
            size="small" 
            sx={{ 
              backgroundColor: '#98D8AA',
              color: '#2C3E50',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#B4E4C7',
              }
            }} 
          />
        );
      case 'in-progress':
        return (
          <Chip 
            label="In Progress" 
            size="small" 
            sx={{ 
              backgroundColor: '#A8D8EA',
              color: '#2C3E50',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#B8E0F0',
              }
            }} 
          />
        );
      case 'scheduled':
        return (
          <Chip 
            label="Scheduled" 
            size="small" 
            sx={{ 
              backgroundColor: '#D4B5FF',
              color: '#2C3E50',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#E0C4FF',
              }
            }} 
          />
        );
      default:
        return (
          <Chip 
            label="Unknown" 
            size="small" 
            sx={{ 
              backgroundColor: '#E0E0E0',
              color: '#2C3E50',
              fontWeight: 500,
            }} 
          />
        );
    }
  };

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
            Notes
          </Typography>
          <Typography sx={{ fontWeight: 700 }} color="text.secondary" gutterBottom>
            Course notes and materials
          </Typography>
        </Box>

        {/* Notes Table */}
        <Box sx={{ 
          animation: `${floatUp} 0.6s ease-out 0.4s forwards`,
          opacity: 0
        }}>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Course
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Notes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notesData.map((item, index) => (
                  <TableRow 
                    key={index}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transition: 'background-color 0.2s ease-in-out'
                      }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {item.course}
                    </TableCell>
                    <TableCell>
                      {item.notes}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(item.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Box>
  );
};

export default Notes; 