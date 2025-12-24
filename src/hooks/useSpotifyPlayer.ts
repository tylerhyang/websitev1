import { useEffect, useState, useRef, useCallback } from 'react';

interface SpotifyPlayerState {
  isReady: boolean;
  isConnected: boolean;
  isPlaying: boolean;
  currentTrack: {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumArt: string;
    duration: number;
  } | null;
  position: number; // in milliseconds
  deviceId: string | null;
  error: string | null;
}

interface UseSpotifyPlayerOptions {
  apiBaseUrl?: string;
  getOAuthToken?: (cb: (token: string) => void) => void;
}

export const useSpotifyPlayer = (options: UseSpotifyPlayerOptions = {}) => {
  const { apiBaseUrl = '/api' } = options;
  const [playerState, setPlayerState] = useState<SpotifyPlayerState>({
    isReady: false,
    isConnected: false,
    isPlaying: false,
    currentTrack: null,
    position: 0,
    deviceId: null,
    error: null,
  });

  const playerRef = useRef<Spotify.Player | null>(null);
  const positionIntervalRef = useRef<number | null>(null);
  const accessTokenRef = useRef<string | null>(null);

  // Get access token from the API
  const getAccessToken = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch(`${apiBaseUrl}/spotify/player-token`);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Failed to parse error response' };
        }
        
        const errorMessage = `Failed to get player access token (${response.status}): ${errorData.message || errorData.error || response.statusText}`;
        console.error('Spotify Player:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      if (!data.access_token) {
        console.error('Spotify Player: No access token in response');
        throw new Error('No access token in response');
      }
      
      return data.access_token;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Spotify Player: Error getting access token:', errorMessage);
      throw error;
    }
  }, [apiBaseUrl]);

  // Initialize the Spotify Player
  useEffect(() => {
    let mounted = true;
    let checkInterval: number | null = null;

    const checkSDKAndInitialize = async () => {
      // Check if SDK is available
      if (!window.Spotify) {
        return false;
      }

      // SDK is available, initialize player
      return await initializePlayer();
    };

    const initializePlayer = async () => {
      try {
        // Get access token
        const token = await getAccessToken();
        accessTokenRef.current = token;

        // Create player
        const player = new window.Spotify.Player({
          name: 'Tyler Yang Website Player',
          getOAuthToken: async (cb: (token: string) => void) => {
            try {
              const newToken = await getAccessToken();
              accessTokenRef.current = newToken;
              cb(newToken);
            } catch (error) {
              console.error('Error refreshing token:', error);
              setPlayerState(prev => ({
                ...prev,
                error: 'Failed to refresh access token',
              }));
            }
          },
          volume: 0.5,
        });

        playerRef.current = player;

        // Error handling
        player.addListener('initialization_error', ({ message }: { message: string }) => {
          console.error('Spotify Player: Initialization error:', message);
          setPlayerState(prev => ({
            ...prev,
            error: `Initialization error: ${message}`,
          }));
        });

        player.addListener('authentication_error', ({ message }: { message: string }) => {
          console.error('Spotify Player: Authentication error:', message);
          setPlayerState(prev => ({
            ...prev,
            error: `Authentication error: ${message}`,
          }));
        });

        player.addListener('account_error', ({ message }: { message: string }) => {
          console.error('Spotify Player: Account error:', message);
          setPlayerState(prev => ({
            ...prev,
            error: `Account error: ${message}. Make sure you have Spotify Premium.`,
          }));
        });

        player.addListener('playback_error', ({ message }: { message: string }) => {
          console.error('Spotify Player: Playback error:', message);
          setPlayerState(prev => ({
            ...prev,
            error: `Playback error: ${message}`,
          }));
        });

        // Ready event
        player.addListener('ready', ({ device_id }: { device_id: string }) => {
          console.log('Spotify Player: Device ready:', device_id);
          setPlayerState(prev => ({
            ...prev,
            isReady: true,
            isConnected: true,
            deviceId: device_id,
            error: null,
          }));
        });

        // Not ready event - device went offline
        player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
          console.warn('Spotify Player: Device went offline:', device_id);
          setPlayerState(prev => ({
            ...prev,
            isConnected: false,
            isReady: false,
            deviceId: null,
          }));
          
          // Automatically attempt to reconnect after a short delay
          setTimeout(async () => {
            if (playerRef.current && mounted) {
              console.log('Spotify Player: Attempting to reconnect...');
              try {
                const reconnectResult = await playerRef.current.connect();
                if (reconnectResult) {
                  console.log('Spotify Player: Reconnection successful');
                } else {
                  console.warn('Spotify Player: Reconnection failed, will retry on next interaction');
                }
              } catch (error) {
                console.error('Spotify Player: Reconnection error:', error);
              }
            }
          }, 2000); // Wait 2 seconds before reconnecting
        });

        // Connection state changed
        player.addListener('player_state_changed', (state: Spotify.PlaybackState | null) => {
          if (!state) {
            setPlayerState(prev => ({
              ...prev,
              isPlaying: false,
              currentTrack: null,
              position: 0,
            }));
            return;
          }

          const track = state.track_window.current_track;
          setPlayerState(prev => ({
            ...prev,
            isPlaying: !state.paused,
            isConnected: true,
            currentTrack: track ? {
              id: track.id,
              name: track.name,
              artist: track.artists[0]?.name || 'Unknown Artist',
              album: track.album.name,
              albumArt: track.album.images[0]?.url || '',
              duration: track.duration_ms,
            } : null,
            position: state.position,
          }));
        });

        // Connect to the player
        console.log('Spotify Player: Connecting...');
        const connectResult = await player.connect();
        if (connectResult) {
          console.log('Spotify Player: Connection initiated, waiting for ready event...');
        } else {
          console.error('Spotify Player: Failed to connect');
          setPlayerState(prev => ({
            ...prev,
            error: 'Failed to connect to Spotify player',
          }));
        }
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Spotify Player: Error initializing:', errorMessage);
        setPlayerState(prev => ({
          ...prev,
          error: `Initialization failed: ${errorMessage}`,
        }));
        return false;
      }
    };

    // Try to initialize immediately
    checkSDKAndInitialize();

    // Set up event listener for SDK ready event
    const handleSDKReady = () => {
      if (mounted) {
        checkSDKAndInitialize();
      }
    };
    window.addEventListener('spotify-sdk-ready', handleSDKReady);

    // Also poll for SDK availability (fallback)
    let pollCount = 0;
    const maxPolls = 60; // 30 seconds max (60 * 500ms)
    checkInterval = window.setInterval(() => {
      pollCount++;
      if (mounted && !window.Spotify) {
        if (pollCount >= maxPolls) {
          console.error('Spotify Player: Timeout waiting for SDK after 30 seconds');
          setPlayerState(prev => ({
            ...prev,
            error: 'Timeout waiting for Spotify SDK. Check network tab.',
          }));
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
        }
      } else if (mounted && window.Spotify && !playerRef.current) {
        checkSDKAndInitialize();
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }
    }, 500);

    // Keep-alive mechanism - periodically check connection status
    const keepAliveInterval = window.setInterval(async () => {
      if (mounted && playerRef.current && playerState.isReady) {
        try {
          const state = await playerRef.current.getCurrentState();
          if (!state && playerState.isConnected) {
            // Device appears to be disconnected but we think it's connected
            console.warn('Spotify Player: Keep-alive check detected disconnection');
            setPlayerState(prev => ({
              ...prev,
              isConnected: false,
            }));
          }
        } catch (error) {
          // Silently handle errors - device might be temporarily unavailable
        }
      }
    }, 10000); // Check every 10 seconds

    // Cleanup
    return () => {
      mounted = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      window.removeEventListener('spotify-sdk-ready', handleSDKReady);
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [getAccessToken, playerState.isReady, playerState.isConnected]);

  // Update position periodically when playing
  useEffect(() => {
    if (playerState.isPlaying && playerRef.current) {
      positionIntervalRef.current = window.setInterval(async () => {
        try {
          const state = await playerRef.current?.getCurrentState();
          if (state && !state.paused) {
            setPlayerState(prev => {
              // Only update if position changed significantly (avoid micro-updates)
              const positionDiff = Math.abs(state.position - prev.position);
              if (positionDiff > 100) { // Only update if changed by more than 100ms
                return {
                  ...prev,
                  position: state.position,
                };
              }
              return prev;
            });
          }
        } catch (error) {
          console.error('Error getting current state:', error);
        }
      }, 250); // Update every 250ms (reduced from 100ms to minimize re-renders)
    } else {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
        positionIntervalRef.current = null;
      }
    }

    return () => {
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, [playerState.isPlaying]);

  // Get available devices and find an active one, or our device
  const getActiveDevice = useCallback(async (token: string, preferredDeviceId: string | null): Promise<string | null> => {
    try {
      const devicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json();
        const devices = devicesData.devices || [];
        
        // First, try to find an already active device
        const activeDevice = devices.find((d: any) => d.is_active);
        if (activeDevice) {
          console.log('Spotify Player: Found active device:', activeDevice.id, activeDevice.name);
          return activeDevice.id;
        }
        
        // If no active device, try to find our preferred device
        if (preferredDeviceId) {
          const ourDevice = devices.find((d: any) => d.id === preferredDeviceId);
          if (ourDevice) {
            console.log('Spotify Player: Found our device, will activate it:', ourDevice.id);
            return ourDevice.id;
          }
        }
        
        // If we have any device, use the first one
        if (devices.length > 0) {
          console.log('Spotify Player: Using first available device:', devices[0].id, devices[0].name);
          return devices[0].id;
        }
        
        console.warn('Spotify Player: No devices found');
        return null;
      }
      
      return null;
    } catch (error) {
      console.warn('Spotify Player: Could not get devices:', error);
      return null;
    }
  }, []);

  // Play a track
  const playTrack = useCallback(async (trackUri: string) => {
    if (!playerRef.current || !playerState.deviceId) {
      setPlayerState(prev => ({
        ...prev,
        error: 'Player not ready. Please wait for initialization.',
      }));
      return;
    }

    // Verify player SDK state
    try {
      const sdkState = await playerRef.current.getCurrentState();
      if (!sdkState && !playerState.isConnected) {
        console.warn('Spotify Player: SDK reports device not connected, reconnecting...');
        const reconnectResult = await playerRef.current.connect();
        if (!reconnectResult) {
          setPlayerState(prev => ({
            ...prev,
            error: 'Device disconnected. Please refresh the page.',
          }));
          return;
        }
        // Wait for ready event
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.warn('Spotify Player: Could not check SDK state:', error);
    }

    try {
      // Always get a fresh token to avoid stale token issues
      const token = await getAccessToken();
      accessTokenRef.current = token;
      
      // Get an active device (or find/activate one)
      let activeDeviceId = await getActiveDevice(token, playerState.deviceId);
      
      // If no device found, try to reconnect and get a new device ID
      if (!activeDeviceId) {
        console.warn('Spotify Player: No active device found, reconnecting SDK...');
        if (playerRef.current) {
          await playerRef.current.disconnect();
          await new Promise(resolve => setTimeout(resolve, 500));
          const reconnectResult = await playerRef.current.connect();
          if (reconnectResult) {
            // Wait for ready event to get new device ID
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Try again with potentially new device ID
            activeDeviceId = await getActiveDevice(token, playerState.deviceId);
          }
        }
        
        if (!activeDeviceId) {
          setPlayerState(prev => ({
            ...prev,
            error: 'No active device found. Please ensure Spotify is open or refresh the page.',
          }));
          return;
        }
      }
      
      // If the active device is not our preferred device, transfer playback to it
      if (activeDeviceId !== playerState.deviceId) {
        console.log('Spotify Player: Transferring playback to device:', activeDeviceId);
        const transferResponse = await fetch(`https://api.spotify.com/v1/me/player`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [activeDeviceId],
            play: false,
          }),
        });

        if (!transferResponse.ok) {
          const transferError = await transferResponse.json().catch(() => ({}));
          console.error('Spotify Player: Failed to transfer playback:', transferError);
          setPlayerState(prev => ({
            ...prev,
            error: 'Failed to activate device. Please try again.',
          }));
          return;
        }

        // Wait for device to become active
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Use the active device ID (might be different from playerState.deviceId)
      const deviceIdToUse = activeDeviceId || playerState.deviceId;
      
      // Now play the track on the active device
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdToUse}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Unknown error' };
        }
        
        // Handle 404 - Device not found or not active
        if (response.status === 404) {
          const errorReason = errorData.error?.reason || '';
          const errorMessage = errorData.error?.message || '';
          
          console.error('Spotify Player: Play failed (404):', errorReason, errorMessage);
          
          // If device is truly gone, we need to reconnect
          if (errorReason === 'NO_ACTIVE_DEVICE' || errorMessage.includes('device')) {
            setPlayerState(prev => ({
              ...prev,
              error: 'Device not active. Please try clicking play again.',
              isReady: false,
              deviceId: null,
            }));
            
            // Attempt to reconnect
            if (playerRef.current) {
              try {
                await playerRef.current.disconnect();
                await new Promise(resolve => setTimeout(resolve, 500));
                const reconnectResult = await playerRef.current.connect();
                if (reconnectResult) {
                  console.log('Spotify Player: Reconnected, please try playing again');
                }
              } catch (reconnectError) {
                console.error('Spotify Player: Reconnection failed:', reconnectError);
              }
            }
          }
          
          return;
        }
        
        // Handle 403 - Scope or permission issues
        if (response.status === 403) {
          const errorMessage = errorData.error?.message || errorData.error?.reason || 'Permission denied';
          console.error('Spotify Player: Permission error (403):', errorMessage);
          setPlayerState(prev => ({
            ...prev,
            error: `Permission error: ${errorMessage}. Check that your refresh token has the 'streaming' scope.`,
          }));
          return;
        }
        
        console.error('Spotify Player: API error:', response.status, errorData);
        setPlayerState(prev => ({
          ...prev,
          error: `Failed to play track (${response.status}): ${errorData.error?.message || errorData.error?.reason || response.statusText}`,
        }));
        return;
      }

      // Small delay to ensure the track is loaded before resuming
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Then resume playback
      await playerRef.current.resume();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Spotify Player: Error playing track:', errorMessage);
      setPlayerState(prev => ({
        ...prev,
        error: `Playback failed: ${errorMessage}`,
      }));
    }
  }, [playerState.deviceId, playerState.isConnected, getAccessToken, getActiveDevice]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (!playerRef.current) {
      return;
    }

    try {
      const state = await playerRef.current.getCurrentState();
      if (state?.paused) {
        await playerRef.current.resume();
      } else {
        await playerRef.current.pause();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }, []);

  // Pause playback
  const pause = useCallback(async () => {
    if (!playerRef.current) {
      return;
    }
    try {
      await playerRef.current.pause();
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }, []);

  // Resume playback
  const resume = useCallback(async () => {
    if (!playerRef.current) {
      return;
    }
    try {
      await playerRef.current.resume();
    } catch (error) {
      console.error('Error resuming:', error);
    }
  }, []);

  // Seek to position
  const seek = useCallback(async (positionMs: number) => {
    if (!playerRef.current) {
      return;
    }
    try {
      await playerRef.current.seek(positionMs);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }, []);

  return {
    ...playerState,
    playTrack,
    togglePlayPause,
    pause,
    resume,
    seek,
  };
};

