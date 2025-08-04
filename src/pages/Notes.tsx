import { Box, Container, Typography, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Link } from '@mui/material';
import { floatUp } from '../components/ui/Animations';
import { useState, useMemo } from 'react';
import type { FC } from 'react';

type NoteItem = {
  course: string;
  university: string;
  url: string;
  status: 'completed' | 'in-progress' | 'scheduled';
};
const Notes: FC = () => {
  const UC_BERKELEY = 'UC Berkeley';
  // const GEORGIA_TECH = 'Georgia Tech';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const notesData: NoteItem[] = [
    {
      course: 'CS 169 - Software Engineering',
      university: UC_BERKELEY,
      url: 'https://docs.google.com/document/d/1LDNRce6HYgEslVF_gqo1N_sUpB-YgPz6T5XC_LgIp2w/edit?tab=t.0#heading=h.1o8ul35vkldf',
      status: 'completed'
    }
  ];

  const universities = useMemo(() => {
    const uniqueUniversities = [...new Set(notesData.map(item => item.university))];
    return ['all', ...uniqueUniversities];
  }, []);

  // Filter and search logic
  const filteredNotes = useMemo(() => {
    return notesData.filter(item => {
      const matchesSearch = item.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUniversity = selectedUniversity === 'all' || item.university === selectedUniversity;
      return matchesSearch && matchesUniversity;
    });
  }, [searchTerm, selectedUniversity]);

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
    <Container sx={{width: "60vw"}}>
    <Box sx={{ 
      px: 3, 
      py: 4,
    }}>
      <Stack direction="column" spacing={6}>
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
        <Box sx={{ 
            animation: `${floatUp} 0.6s ease-out 0.3s forwards`,
            opacity: 0
          }}>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <TextField
                label="Search by course name"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1 }}
                placeholder="e.g., Machine Learning, CS 7641"
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>University</InputLabel>
                <Select
                  value={selectedUniversity}
                  label="University"
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                >
                  {universities.map((university) => (
                    <MenuItem key={university} value={university}>
                      {university === 'all' ? 'All Universities' : university}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
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
                    University
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
                  {filteredNotes.map((item, index) => (
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
                        {item.university}
                      </TableCell>
                      <TableCell>
                      {<Link 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'none',
                        fontWeight: 500,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(152, 216, 170, 0.1)',
                        transition: 'all 0.2s ease-in-out',
                        display: 'inline-block',
                        '&:hover': {
                          backgroundColor: '#98D8AA',
                          color: 'black',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(152, 216, 170, 0.3)'
                        }
                      }}
                        >
                        link
                      </Link>}
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
    </Container>
  );
};

export default Notes; 