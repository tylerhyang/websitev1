import { Handler } from '@netlify/functions';
import { getCachedAccessToken } from './spotify-token-cache';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
  preview_url: string | null;
}

interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

interface TransformedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  spotifyUrl: string;
  playedAt?: string;
  duration: number; // duration in milliseconds
  previewUrl?: string; // Preview URL for playback
}


/**
 * Transform Spotify track object to our frontend format
 */
function transformTrack(track: SpotifyTrack, playedAt?: string): TransformedTrack {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    album: track.album.name,
    albumArt: track.album.images[0]?.url || '',
    spotifyUrl: track.external_urls.spotify,
    duration: track.duration_ms,
    ...(playedAt ? { playedAt } : {}),
    ...(track.preview_url ? { previewUrl: track.preview_url } : {}),
  };
}

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const accessToken = await getCachedAccessToken();
    
    const response = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=10',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Spotify API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json() as { items: RecentlyPlayedItem[] };
    const tracks = data.items.map(item => transformTrack(item.track, item.played_at));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ tracks }),
    };
  } catch (error) {
    console.error('Error fetching recently played:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to fetch recently played tracks',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

