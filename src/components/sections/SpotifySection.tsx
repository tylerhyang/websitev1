import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { useEffect, useState, memo } from 'react';
import { floatUp } from '../ui/Animations';
import type { FC } from 'react';

type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  spotifyUrl: string;
  playedAt?: string; // For recently played tracks
  duration: number; // duration in milliseconds
};

interface SpotifySectionProps {
  apiBaseUrl?: string; // Backend API base URL
}

const SpotifySection: FC<SpotifySectionProps> = ({ apiBaseUrl = '/api' }) => {
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [recentError, setRecentError] = useState<string | null>(null);
  const [topError, setTopError] = useState<string | null>(null);
  const [tabKey, setTabKey] = useState(0);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      setLoading(true);
      setRecentError(null);
      setTopError(null);

      // Fetch both endpoints in parallel and wait for both to complete
      const [recentResult, topResult] = await Promise.allSettled([
        // Fetch recently played tracks
        fetch(`${apiBaseUrl}/spotify/recently-played`)
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || `Failed to fetch recently played tracks (${response.status})`);
            }
            return response.json();
          })
          .then((data) => {
            // Remove duplicates based on track ID
            const uniqueRecentTracks: Track[] = Array.from(
              new Map((data.tracks || []).map((track: Track) => [track.id, track])).values()
            ) as Track[];
            return uniqueRecentTracks;
          }),
        
        // Fetch top tracks
        fetch(`${apiBaseUrl}/spotify/top-tracks`)
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || `Failed to fetch top tracks (${response.status})`);
            }
            return response.json();
          })
          .then((data) => {
            // Remove duplicates based on track ID
            const uniqueTopTracks: Track[] = Array.from(
              new Map((data.tracks || []).map((track: Track) => [track.id, track])).values()
            ) as Track[];
            return uniqueTopTracks;
          })
      ]);

      // Handle recently played results
      if (recentResult.status === 'fulfilled') {
        setRecentTracks(recentResult.value);
      } else {
        console.error('Error fetching recently played:', recentResult.reason);
        setRecentError(recentResult.reason instanceof Error ? recentResult.reason.message : 'Failed to load recently played tracks');
      }

      // Handle top tracks results
      if (topResult.status === 'fulfilled') {
        setTopTracks(topResult.value);
      } else {
        console.error('Error fetching top tracks:', topResult.reason);
        setTopError(topResult.reason instanceof Error ? topResult.reason.message : 'Failed to load top tracks');
      }

      // Only set loading to false after both requests have completed
      setLoading(false);
    };

    fetchSpotifyData();
  }, [apiBaseUrl]);


  // Featured track card (large card on left)
  const FeaturedTrackCard = memo(({ track, delay = 0 }: { track: Track; delay?: number }) => {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            animation: `${floatUp} 0.6s ease-out ${delay}s forwards`,
            opacity: 0,
            '& iframe': {
              borderRadius: '12px',
              border: 'none',
            }
          }}
        >
          <iframe
            src={`https://open.spotify.com/embed/track/${track.id}?theme=1`}
            width="100%"
            height="400"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{
              borderRadius: '12px',
              border: 'none',
            }}
          />
        </Box>
      </Box>
    );
  }, (prevProps, nextProps) => {
    // Only re-render if the track ID changes    
    return prevProps.track.id === nextProps.track.id;
  });

  // Small track card (for list on right)
  const SmallTrackCard = memo(({ track, delay = 0 }: { track: Track; delay?: number }) => {
    return (
      <Box 
        component="div"
        sx={{ 
          width: '100%', 
          margin: 0, 
          padding: 0, 
          lineHeight: 0, 
          display: 'block',
          fontSize: 0,
          animation: `${floatUp} 0.6s ease-out ${delay}s forwards`,
          opacity: 0,
          '& iframe': {
            margin: 0,
            padding: 0,
            display: 'block',
            verticalAlign: 'top',
            border: 'none',
          }
        }}
      >
        <iframe
          src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{
            borderRadius: 0,
            border: 'none',
            margin: 0,
            padding: 0,
            display: 'block',
            verticalAlign: 'top',
            outline: 'none',
          }}
        />
      </Box>
    );
  }, (prevProps, nextProps) => {
    // Only re-render if the track ID changes
    return prevProps.track.id === nextProps.track.id;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const hasRecentTracks = recentTracks.length > 0;
  const hasTopTracks = topTracks.length > 0;

  return (
    <Paper
      elevation={3}
      sx={{
        pt: 4,
        px: 4,
        pb: 2,
        width: '100%',
        maxWidth: '800px',
        borderRadius: 4,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        animation: `${floatUp} 0.6s ease-out 0.6s forwards`,
        opacity: 0,
      }}
    >
      {/* Header with Tabs */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
            What i'm listening to
          </Typography>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setTabKey(prev => prev + 1); // Trigger animation on tab change
            }}
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTabs-flexContainer': {
                alignItems: 'center',
              },
            }}
          >
            <Tab 
              label="Recently Played" 
              sx={{
                textTransform: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                minHeight: 'auto',
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'text.primary',
                },
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:focus': {
                  backgroundColor: 'transparent',
                  outline: 'none',
                  '&.Mui-selected': {
                    color: 'text.primary',
                  },
                  '&:not(.Mui-selected)': {
                    color: 'text.secondary',
                  },
                },
                '&:active': {
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                },
              }}
            />
            <Tab 
              label="Top Tracks" 
              sx={{
                textTransform: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                minHeight: 'auto',
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'text.primary',
                },
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                },
                '&:focus-visible': {
                  outline: 'none',
                },
                '&:focus': {
                  backgroundColor: 'transparent',
                  outline: 'none',
                  '&.Mui-selected': {
                    color: 'text.primary',
                  },
                  '&:not(.Mui-selected)': {
                    color: 'text.secondary',
                  },
                },
                '&:active': {
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                  outline: 'none',
                },
              }}
            />
          </Tabs>
        </Stack>
      </Box>

      {/* Content */}
      <Box key={tabKey}>
        {activeTab === 0 && (
          <>
            {recentError ? (
              <Typography color="error" variant="body2" sx={{ textAlign: 'center', py: 4 }}>
                {recentError}
              </Typography>
            ) : !hasRecentTracks ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No recently played tracks. Play some music on Spotify to see your recent activity here!
              </Typography>
            ) : (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ width: '100%', alignItems: 'stretch' }}>
                {/* Featured Track (Left) */}
                <Box 
                  sx={{ 
                    flex: { xs: '1 1 100%', md: '1 1 0' }, 
                    minWidth: 0, 
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <FeaturedTrackCard track={recentTracks[0]} delay={0} />
                </Box>

                {/* Track List (Right) */}
                <Stack 
                  spacing={0} 
                  sx={{ 
                    flex: { xs: '1 1 100%', md: '1 1 0' }, 
                    minWidth: 0,
                    margin: 0,
                    padding: 0,
                    gap: 0,
                    alignItems: 'flex-start',
                    '& > *': {
                      margin: '0 !important',
                      padding: '0 !important',
                      marginTop: '0 !important',
                      marginBottom: '0 !important',
                    },
                    '& > *:not(:last-child)': {
                      marginBottom: '-20px !important',
                    }
                  }}
                >
                  {recentTracks.slice(1, 5).map((track, index) => (
                    <Box
                      key={track.id}
                      component="div"
                      sx={{
                        margin: '0 !important',
                        padding: '0 !important',
                        lineHeight: 0,
                        display: 'block',
                        fontSize: 0,
                        '& iframe': {
                          marginBottom: '-40px !important',
                        }
                      }}
                    >
                      <SmallTrackCard track={track} delay={0.2 + (index * 0.15)} />
                    </Box>
                  ))}
                </Stack>
              </Stack>
            )}
          </>
        )}

        {activeTab === 1 && (
          <>
            {topError ? (
              <Typography color="error" variant="body2" sx={{ textAlign: 'center', py: 4 }}>
                {topError}
              </Typography>
            ) : !hasTopTracks ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No top tracks data available. Spotify needs more listening history to generate top tracks.
              </Typography>
            ) : (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ width: '100%', alignItems: 'stretch' }}>
                {/* Featured Track (Left) */}
                <Box 
                  sx={{ 
                    flex: { xs: '1 1 100%', md: '1 1 0' }, 
                    minWidth: 0, 
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <FeaturedTrackCard track={topTracks[0]} delay={0} />
                </Box>

                {/* Track List (Right) */}
                <Stack 
                  spacing={0} 
                  sx={{ 
                    flex: { xs: '1 1 100%', md: '1 1 0' }, 
                    minWidth: 0,
                    margin: 0,
                    padding: 0,
                    gap: 0,
                    alignItems: 'flex-start',
                    '& > *': {
                      margin: '0 !important',
                      padding: '0 !important',
                      marginTop: '0 !important',
                      marginBottom: '0 !important',
                    },
                    '& > *:not(:last-child)': {
                      marginBottom: '-20px !important',
                    }
                  }}
                >
                  {topTracks.slice(1, 5).map((track, index) => (
                    <Box
                      key={track.id}
                      component="div"
                      sx={{
                        margin: '0 !important',
                        padding: '0 !important',
                        lineHeight: 0,
                        display: 'block',
                        fontSize: 0,
                        '& iframe': {
                          marginBottom: '-40px !important',
                        }
                      }}
                    >
                      <SmallTrackCard track={track} delay={0.2 + (index * 0.15)} />
                    </Box>
                  ))}
                </Stack>
              </Stack>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default SpotifySection;
