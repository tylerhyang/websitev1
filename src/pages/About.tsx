import { Box, Typography, Stack, Paper } from '@mui/material';
import FlipCardGrid from '../components/sections/FlipCardGrid';
import Timeline from '../components/sections/Timeline';
import { floatUp } from '../components/ui/Animations';
import type { FC } from 'react';
import catImage from '/assets/cat.jpg';
import potteryImage from '/assets/pottery.jpg';
import threeSistersImage from '/assets/three_sisters_au.jpg';

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  company: string;
  companyUrl: string;
};

const About: FC = () => {
  const images = [
    {
      frontImage: catImage,
      backText: 'My cat, Remy',
      title: 'Remy',
      date: 'March 2025',
      location: 'San Francisco, CA'
    },
    {
      frontImage: potteryImage,
      backText: "I enjoy making pottery in my free time",
      title: 'Pottery',
      date: 'December 2024',
      location: 'San Francisco, CA'
    },
    {
      frontImage: threeSistersImage,
      backText: 'Viewpoint from Three Sisters hike',
      title: 'Three Sisters Hike',
      date: 'June 2025',
      location: 'NSW, Australia'
    }
  ];

  const technologies = {
    Languages: [
      { name: 'Bash', icon: 'devicon-bash-plain' },
      { name: 'C++', icon: 'devicon-cplusplus-plain' },
      { name: 'Go', icon: 'devicon-go-original-wordmark' },
      { name: 'Java', icon: 'devicon-java-plain' },
      { name: 'Python', icon: 'devicon-python-plain' },
      { name: 'Ruby', icon: 'devicon-ruby-plain' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain' }
    ],
    Frameworks: [
      { name: 'Airflow', icon: 'devicon-apacheairflow-plain' },
      { name: 'FastAPI', icon: 'devicon-fastapi-plain' },
      { name: 'Flask', icon: 'devicon-flask-original' },
      { name: 'PyTorch', icon: 'devicon-pytorch-original' },
      { name: 'React', icon: 'devicon-react-original' },
      { name: 'Scikit-Learn', icon: 'devicon-scikitlearn-plain' },
      { name: 'TensorFlow', icon: 'devicon-tensorflow-original' }
    ],
    Tools: [
      { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark' },
      { name: 'Azure', icon: 'devicon-azure-plain' },
      { name: 'Docker', icon: 'devicon-docker-plain' },
      { name: 'GCP', icon: 'devicon-googlecloud-plain' },
      { name: 'gRPC', icon: 'devicon-grpc-plain' },
      { name: 'Git', icon: 'devicon-git-plain' },
      { name: 'GraphQL', icon: 'devicon-graphql-plain' },  
      { name: 'Helm', icon: 'devicon-helm-plain' },
      { name: 'Kafka', icon: 'devicon-apachekafka-plain' },
      { name: 'Kubernetes', icon: 'devicon-kubernetes-plain' },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },    
      { name: 'Prometheus', icon: 'devicon-prometheus-original' },
      { name: 'Redis', icon: 'devicon-redis-plain' },
      { name: 'Swagger', icon: 'devicon-swagger-plain' },
    ],
  };

  const timelineItems: TimelineItem[] = [
    {
      year: '2025 - Present',
      company: 'Georgia Institute of Technology',
      companyUrl: 'https://www.gatech.edu',
      title: 'M.S. Computer Science',
      description: 'Concentration: Machine Learning'
    },
    {
      year: '2025 - Present',
      company: 'Glean',
      companyUrl: 'https://www.glean.com',
      title: 'Software Engineer - Data Foundations',
      description: 'Data connectors and infrastructure for search'
    },
    {
      year: '2023 - 2025',
      company: 'Cloudera',
      companyUrl: 'https://www.cloudera.com',
      title: 'Software Engineer II - Gen AI/ML',
      description: 'Model serving infrastructure on KServe'
    },
    {
      year: '2019 -2023',
      company: 'University of California, Berkeley',
      companyUrl: 'https://www.berkeley.edu',
      title: 'B.A. Computer Science',
      description: 'GPA: 3.9/4'
    },
    {
      year: '2022 - 2022',
      company: 'Cloudera',
      companyUrl: 'https://www.cloudera.com',
      title: 'Software Engineer Intern - Machine Learning',
      description: 'Kubernetes operators for AI Workloads'
    },
    {
      year: '2021 - 2021',
      company: 'University of California, Berkeley',
      companyUrl: 'https://www.berkeley.edu',
      title: 'Undergraduate Researcher',
      description: 'Pipeline load balancing and graph search heuristics'
    },
  ];

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
            About
          </Typography>
          <Typography sx={{ fontWeight: 700 }} color="text.secondary" gutterBottom>
            Who I am
          </Typography>
        </Box>
        {/* Flip Card Grid Section */}
          <FlipCardGrid images={images}/>
        {/* Timeline Section */}
        <Box sx={{ 
          animation: `${floatUp} 0.6s ease-out 0.6s forwards`,
          opacity: 0
        }}>
          <Box sx={{ 
            textAlign: 'left',
            animation: `${floatUp} 0.6s ease-out 0.2s forwards`,
            opacity: 0
          }}>
            <Typography gutterBottom sx={{ fontWeight: 500, fontSize: '1.3rem' }}>
              Timeline
            </Typography>
          </Box>
          <Timeline items={timelineItems} />
        </Box>

        {/* Technologies Section */}
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography sx={{ fontWeight: 500, fontSize: '1.3rem' }}>
              Technologies
            </Typography>
          </Box>
          <Stack spacing={3}>
            {Object.entries(technologies).map(([category, items]) => (
              <Paper elevation={3} sx={{ p: 4 }}>
                <Box 
                  key={category}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    p: 2,
                    borderRadius: 2,
                    '&:hover': {
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 500,
                      minWidth: '120px',
                      color: 'inherit'
                    }}
                  >
                    {category}
                  </Typography>
                  <Box 
                    sx={{ 
                      width: '1px',
                      height: '40px',
                      backgroundColor: 'divider',
                      mx: 2
                    }} 
                  />
                  <Box sx={{ 
                    display: 'flex',
                    gap: 3,
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    {items.map((tech) => (
                      <Box
                        key={tech.name}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.5,
                          p: 1,
                          borderRadius: 1,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease-in-out'
                          }
                        }}
                      >
                        <i 
                          className={`${tech.icon}`} 
                          style={{ 
                            fontSize: '2rem',
                            color: 'inherit'
                          }} 
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: 'center',
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                        >
                          {tech.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
      </Stack>
    </Box>
  );
};

export default About; 