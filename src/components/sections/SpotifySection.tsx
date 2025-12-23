import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Avatar, 
  Link, 
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  LinearProgress,
  Button
} from '@mui/material';
import { 
  PlayArrow, 
  Add
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
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
  const [albumColors, setAlbumColors] = useState<Record<string, string>>({});
  const [tabKey, setTabKey] = useState(0);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        setLoading(true);
        setRecentError(null);
        setTopError(null);

        // Fetch recently played tracks
        try {
          const recentResponse = await fetch(`${apiBaseUrl}/spotify/recently-played`);
          if (!recentResponse.ok) {
            const errorData = await recentResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch recently played tracks (${recentResponse.status})`);
          }
          const recentData = await recentResponse.json();
          // Remove duplicates based on track ID
          const uniqueRecentTracks: Track[] = Array.from(
            new Map((recentData.tracks || []).map((track: Track) => [track.id, track])).values()
          ) as Track[];
          setRecentTracks(uniqueRecentTracks);
        } catch (err) {
          console.error('Error fetching recently played:', err);
          setRecentError(err instanceof Error ? err.message : 'Failed to load recently played tracks');
        }

        // Fetch top tracks
        try {
          const topResponse = await fetch(`${apiBaseUrl}/spotify/top-tracks`);
          if (!topResponse.ok) {
            const errorData = await topResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch top tracks (${topResponse.status})`);
          }
          const topData = await topResponse.json();
          // Remove duplicates based on track ID
          const uniqueTopTracks: Track[] = Array.from(
            new Map((topData.tracks || []).map((track: Track) => [track.id, track])).values()
          ) as Track[];
          setTopTracks(uniqueTopTracks);
        } catch (err) {
          console.error('Error fetching top tracks:', err);
          setTopError(err instanceof Error ? err.message : 'Failed to load top tracks');
        }
      } catch (err) {
        console.error('Error fetching Spotify data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();
  }, [apiBaseUrl]);

  // Extract dominant color from album art images
  useEffect(() => {
    const extractColor = (imageUrl: string, trackId: string) => {
      setAlbumColors(prev => {
        if (prev[trackId]) return prev; // Already extracted
        return prev;
      });
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setAlbumColors(prev => {
              if (!prev[trackId]) {
                return { ...prev, [trackId]: getTrackColor(trackId) };
              }
              return prev;
            });
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Sample pixels and find dominant color
          const colorCounts: Record<string, number> = {};
          const sampleSize = 100; // Sample every Nth pixel
          
          for (let i = 0; i < data.length; i += sampleSize * 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a < 128) continue; // Skip transparent pixels
            
            // Round to reduce color variations
            const roundedR = Math.round(r / 10) * 10;
            const roundedG = Math.round(g / 10) * 10;
            const roundedB = Math.round(b / 10) * 10;
            const colorKey = `${roundedR},${roundedG},${roundedB}`;
            
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
          }
          
          // Find most common color
          let maxCount = 0;
          let dominantColor = '#065F46'; // Default fallback
          
          for (const [color, count] of Object.entries(colorCounts)) {
            if (count > maxCount) {
              maxCount = count;
              const [r, g, b] = color.split(',').map(Number);
              dominantColor = `rgb(${r}, ${g}, ${b})`;
            }
          }
          
          setAlbumColors(prev => {
            if (!prev[trackId]) {
              return { ...prev, [trackId]: dominantColor };
            }
            return prev;
          });
        } catch (err) {
          console.error('Error extracting color:', err);
          setAlbumColors(prev => {
            if (!prev[trackId]) {
              return { ...prev, [trackId]: getTrackColor(trackId) };
            }
            return prev;
          });
        }
      };
      img.onerror = () => {
        setAlbumColors(prev => {
          if (!prev[trackId]) {
            return { ...prev, [trackId]: getTrackColor(trackId) };
          }
          return prev;
        });
      };
      img.src = imageUrl;
    };

    // Extract colors for all tracks
    const allTracks = [...recentTracks, ...topTracks];
    allTracks.forEach(track => {
      if (track.albumArt) {
        setAlbumColors(prev => {
          if (!prev[track.id]) {
            extractColor(track.albumArt, track.id);
          }
          return prev;
        });
      }
    });
  }, [recentTracks, topTracks]);

  // Format duration from milliseconds to MM:SS
  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get progress percentage (simulated - you could use actual playback position if available)
  const getProgress = (_trackId: string): number => {
    return 0; // Set to 0
  };

  // Get dominant color from album art (simplified - using a hash of the track ID for consistent colors)
  const getTrackColor = (trackId: string): string => {
    const colors = [
      '#065F46', // Dark teal
      '#166534', // Dark green
      '#4B5563', // Dark grey
      '#065F46', // Dark teal (duplicate for variety)
      '#1E3A8A', // Dark blue
      '#7C2D12', // Brown
      '#581C87', // Purple
    ];
    const hash = trackId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Check if a color is light (for text contrast)
  const isLightColor = (color: string): boolean => {
    // Handle rgb format: rgb(r, g, b)
    let r = 0, g = 0, b = 0;
    
    if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (match && match.length >= 3) {
        r = parseInt(match[0]);
        g = parseInt(match[1]);
        b = parseInt(match[2]);
      }
    } else if (color.startsWith('#')) {
      // Handle hex format: #RRGGBB
      const hex = color.slice(1);
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5; // Light if luminance > 50%
  };

  // Featured track card (large card on left)
  const FeaturedTrackCard = ({ track }: { track: Track }) => {
    const bgColor = albumColors[track.id] || getTrackColor(track.id);
    const progress = getProgress(track.id);
    const isLight = isLightColor(bgColor);
    const textColor = isLight ? '#000000' : '#ffffff';
    
    return (
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: '360px', md: '400px' },
          maxHeight: { xs: '360px', md: '400px' },
          borderRadius: 3,
          backgroundColor: bgColor,
          backgroundImage: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: 2.5,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        {/* Album Art */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: 1.5,
            flexShrink: 0,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              width: { xs: 140, md: 170 },
              height: { xs: 140, md: 170 },
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: 'white',
            }}
          >
            <Avatar
              src={track.albumArt}
              alt={track.album}
              variant="square"
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 2,
              }}
            />
          </Paper>
        </Box>

        {/* Track Info */}
        <Box sx={{ color: textColor, mb: 1, flexShrink: 0 }}>
          <Typography
            component={Link}
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 0.25,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: textColor,
              textDecoration: 'none',
              display: 'block',
              fontSize: { xs: '1rem', md: '1.1rem' },
              '&:hover': {
                textDecoration: 'underline',
                color: textColor,
                backgroundColor: 'transparent',
              },
              '&:visited': {
                color: textColor,
              },
            }}
          >
            {track.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: textColor,
              opacity: 0.9,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
            }}
          >
            {track.artist}
          </Typography>
        </Box>

        {/* Save Button */}
        <Button
          component={Link}
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<Add />}
          sx={{
            color: textColor,
            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            textTransform: 'none',
            mb: 1.5,
            alignSelf: 'flex-start',
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            py: 0.4,
            px: 1.25,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.3)',
              color: textColor,
            },
            '&:visited': {
              color: textColor,
            },
            '&:focus': {
              color: textColor,
              outline: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
            },
            '&:active': {
              color: textColor,
              outline: 'none',
            },
          }}
        >
          Save on Spotify
        </Button>

        {/* Progress Bar and Controls */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 'auto', flexShrink: 0, pt: 0.5 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: textColor,
                  borderRadius: 2,
                },
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: textColor, minWidth: 40, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
            {formatDuration(track.duration)}
          </Typography>
          <IconButton
            component={Link}
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: isLight ? 'white' : 'white',
              backgroundColor: isLight ? textColor : bgColor,
              width: { xs: 48, md: 52 },
              height: { xs: 48, md: 52 },
              flexShrink: 0,
              '&:hover': {
                backgroundColor: isLight ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                transform: 'scale(1.1)',
                color: isLight ? 'white' : bgColor,
              },
              '&:focus': {
                outline: 'none',
                backgroundColor: isLight ? textColor : bgColor,
                color: isLight ? 'white' : 'white',
              },
              '&:focus-visible': {
                outline: 'none',
                backgroundColor: isLight ? textColor : bgColor,
                color: isLight ? 'white' : 'white',
              },
              '&:active': {
                outline: 'none',
                backgroundColor: isLight ? textColor : bgColor,
                color: isLight ? 'white' : 'white',
              },
              transition: 'all 0.2s',
              '& .MuiSvgIcon-root': {
                color: isLight ? 'white' : 'white',
              },
            }}
          >
            <PlayArrow sx={{ fontSize: { xs: 24, md: 28 }, color: isLight ? 'white' : 'white' }} />
          </IconButton>
        </Stack>
      </Paper>
    );
  };

  // Small track card (for list on right)
  const SmallTrackCard = ({ track }: { track: Track }) => {
    const bgColor = albumColors[track.id] || getTrackColor(track.id);
    const progress = getProgress(track.id);
    const isLight = isLightColor(bgColor);
    const textColor = isLight ? '#000000' : '#ffffff';
    
    return (
      <Paper
        component={Link}
        href={track.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 90, md: 100 },
          maxHeight: { xs: 90, md: 100 },
          borderRadius: 2,
          backgroundColor: bgColor,
          backgroundImage: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          gap: 1.5,
          textDecoration: 'none',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
          },
          '&:active': {
            outline: 'none',
          },
        }}
      >
        {/* Album Art */}
        <Avatar
          src={track.albumArt}
          alt={track.album}
          variant="rounded"
          sx={{
            width: { xs: 70, md: 80 },
            height: { xs: 70, md: 80 },
            borderRadius: 1.5,
            boxShadow: 2,
            flexShrink: 0,
          }}
        />

        {/* Track Info */}
        <Box sx={{ flex: 1, color: textColor, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mb: 0.25,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.875rem',
              color: textColor,
            }}
          >
            {track.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: textColor,
              opacity: 0.85,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0.75,
              fontSize: '0.75rem',
            }}
          >
            {track.artist}
          </Typography>
          
          {/* Progress Bar */}
          <Box sx={{ mb: 0.25 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 2,
                borderRadius: 2,
                backgroundColor: isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: textColor,
                  borderRadius: 2,
                },
              }}
            />
          </Box>
          
          {/* Duration */}
          <Typography variant="caption" sx={{ color: textColor, opacity: 0.9, fontSize: '0.7rem' }}>
            {formatDuration(track.duration)}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              window.open(track.spotifyUrl, '_blank');
            }}
            sx={{
              color: textColor,
              backgroundColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              width: 28,
              height: 28,
              '&:hover': {
                backgroundColor: isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.3)',
              },
              '&:focus': {
                outline: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
              },
              '&:active': {
                outline: 'none',
              },
            }}
          >
            <Add sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              window.open(track.spotifyUrl, '_blank');
            }}
            sx={{
              color: bgColor,
              backgroundColor: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'scale(1.1)',
              },
              '&:focus': {
                outline: 'none',
                backgroundColor: 'white',
              },
              '&:focus-visible': {
                outline: 'none',
                backgroundColor: 'white',
              },
              '&:active': {
                outline: 'none',
                backgroundColor: 'white',
              },
              transition: 'all 0.2s',
            }}
          >
            <PlayArrow sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Paper>
    );
  };

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
        p: 4,
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
              disableRipple
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
            <Tab 
              label="Top Tracks" 
              disableRipple
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
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
                {/* Featured Track (Left) */}
                <Box 
                  sx={{ 
                    flex: { xs: '1 1 100%', md: '0 0 48%' }, 
                    minWidth: 0, 
                    maxWidth: { md: '48%' },
                    animation: `${floatUp} 0.6s ease-out forwards`,
                    opacity: 0,
                  }}
                >
                  <FeaturedTrackCard track={recentTracks[0]} />
                </Box>

                {/* Track List (Right) */}
                <Stack spacing={1.5} sx={{ flex: { xs: '1 1 100%', md: '1 1 52%' }, minWidth: 0 }}>
                  {recentTracks.slice(1, 5).map((track, index) => (
                    <Box
                      key={track.id}
                      sx={{
                        animation: `${floatUp} 0.6s ease-out ${0.1 * (index + 1)}s forwards`,
                        opacity: 0,
                      }}
                    >
                      <SmallTrackCard track={track} />
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
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
                {/* Featured Track (Left) */}
                <Box 
                  sx={{ 
                    flex: { xs: '1 1 100%', md: '0 0 48%' }, 
                    minWidth: 0, 
                    maxWidth: { md: '48%' },
                    animation: `${floatUp} 0.6s ease-out forwards`,
                    opacity: 0,
                  }}
                >
                  <FeaturedTrackCard track={topTracks[0]} />
                </Box>

                {/* Track List (Right) */}
                <Stack spacing={1.5} sx={{ flex: { xs: '1 1 100%', md: '1 1 52%' }, minWidth: 0 }}>
                  {topTracks.slice(1, 5).map((track, index) => (
                    <Box
                      key={track.id}
                      sx={{
                        animation: `${floatUp} 0.6s ease-out ${0.1 * (index + 1)}s forwards`,
                        opacity: 0,
                      }}
                    >
                      <SmallTrackCard track={track} />
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
