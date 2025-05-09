import { Typography, Box, Stack, Container, Card, CardContent, Chip, Link } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import type { FC } from 'react';
import { floatUp } from '../components/ui/animations';

type Project = {
  name: string;
  url: string;
  description: string;
  technologies: string[];
};

const Projects: FC = () => {
  const openSourceProjects: Project[] = [
    {
      name: "KServe - Annotation Injection for Payload Logging",
      url: "https://github.com/kserve/kserve/pull/4325",
      description: "Enable specified inferenceservice annotations to be propagated down to the agent sidecar for payload logging",
      technologies: ["Go", "Kubernetes", "Docker"]
    },
    {
      name: "KServe - User-Supplied Inference Payload Logging Schemas",
      url: "https://github.com/kserve/kserve/pull/4392",
      description: "Enable user to bring their own inference payload logging schemas to be used for payload logging",
      technologies: ["Go", "Kubernetes", "Docker"]
    }
  ];

  const personalProjects: Project[] = [
    {
      name: "Personal Website",
      url: "https://tylerhyang.com",
      description: "This current website.  Built to share who I am and what I've done.",
      technologies: ["Typescript", "React", "Material-UI", "HTML", "CSS"]
    },
    {
      name: "Cloth Physics Simulator",
      url: "https://cal-cs184-student.github.io/p4-clothsim-sp23-vwu-tyang/",
      description: "Cloth physics simulator to simulate the behavior of cloth in a 3D environment",
      technologies: ["C++", "C", "Objective-C"]
    },
    {
      name: "Raytracing Simulator",
      url: "https://cal-cs184-student.github.io/p3-2-pathtracer-sp23-184-vwu-tyang/",
      description: "Raytracing simulator on various objects and materials for accurate lighting predictions",
      technologies: ["C++", "C", "Objective-C"]
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ px: 3, py: 4, width: '60vw' }}>
        <Stack spacing={6}>
          {/* Header */}
          <Box sx={{ 
            textAlign: 'left',
            animation: `${floatUp} 0.6s ease-out 0.2s forwards`,
            opacity: 0
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
              Projects
            </Typography>
            <Typography sx={{ fontWeight: 700 }} color="text.secondary">
              What I'm working on
            </Typography>
          </Box>

          {/* Open Source Contributions */}
          <Box sx={{ 
            animation: `${floatUp} 0.6s ease-out 0.3s forwards`,
            opacity: 0
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: 'text.secondary'
              }}
            >
              Open Source Contributions
            </Typography>
            <Stack spacing={3}>
              {openSourceProjects.map((project) => (
                <Card 
                  key={project.name}
                  elevation={2}
                  sx={{
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GitHub />
                        <Link 
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          <Typography variant="h6" component="div">
                            {project.name}
                          </Typography>
                        </Link>
                      </Box>
                      <Typography variant="body1" color="text.secondary"sx={{ textAlign: 'left' }}>
                        {project.description}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {project.technologies.map((tech) => (
                          <Chip
                            key={tech}
                            label={tech}
                            size="small"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'primary.contrastText',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Personal Projects */}
          <Box sx={{ 
            animation: `${floatUp} 0.6s ease-out 0.4s forwards`,
            opacity: 0
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: 'text.secondary'
              }}
            >
              Personal Projects
            </Typography>
            <Stack spacing={3}>
              {personalProjects.map((project) => (
                <Card 
                  key={project.name}
                  elevation={2}
                  sx={{
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'left', gap: 1 }}>
                        <GitHub />
                        <Link 
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            color: 'inherit',
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          <Typography variant="h6" component="div">
                            {project.name}
                          </Typography>
                        </Link>
                      </Box>
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left' }}>
                        {project.description}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {project.technologies.map((tech) => (
                          <Chip
                            key={tech}
                            label={tech}
                            size="small"
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'primary.contrastText',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default Projects; 