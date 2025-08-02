import { Box, Typography, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { floatUp } from '../components/ui/Animations';
import type { FC } from 'react';

type NoteItem = {
  course: string;
  notes: string;
  status: 'completed' | 'in-progress';
};

const Notes: FC = () => {
  const notesData: NoteItem[] = [
    {
      course: 'TBD',
      notes: 'TBD',
      status: 'unknown'
    }
  ];

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'in-progress':
        return <Chip label="In Progress" color="info" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
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