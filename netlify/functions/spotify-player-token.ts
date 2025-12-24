import { Handler } from '@netlify/functions';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

/**
 * Get a player access token for Web Playback SDK
 * This requires the 'streaming' scope in addition to other scopes
 * 
 * IMPORTANT: 
 * - The refresh token must have been obtained WITH the 'streaming' scope
 * - If you get a 403 from /v1/melody/v1/check_scope, your refresh token doesn't have 'streaming'
 * - You MUST re-authorize to get a new refresh token with all scopes
 * - The Web Playback SDK also requires a Spotify Premium account
 * 
 * NOTE: Console logs appear in Netlify Function logs, not browser console
 * View them in: Netlify Dashboard → Functions → spotify-player-token → Logs
 */
async function getPlayerAccessToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get access token: ${error.error_description || error.error}`);
  }

  const data = await response.json();
  
  // Log the full response for debugging (excluding sensitive token)
  console.log('Token refresh response:', {
    has_scope: !!data.scope,
    scope: data.scope || 'NOT PROVIDED BY SPOTIFY',
    token_type: data.token_type,
    expires_in: data.expires_in,
    // Don't log the actual token for security
  });
  
  // Spotify doesn't always return scope in refresh responses
  // The scopes are "remembered" from the original authorization
  // If scope is not provided, we can't verify it here
  if (data.scope) {
    console.log('✅ Access token scopes:', data.scope);
    if (!data.scope.includes('streaming')) {
      console.warn('⚠️ WARNING: Access token does not include "streaming" scope. The Web Playback SDK will fail with 403 errors. You need to re-authorize with the streaming scope.');
    } else {
      console.log('✅ Token includes "streaming" scope');
    }
  } else {
    console.warn('⚠️ Spotify did not return scope information in token refresh response.');
    console.warn('⚠️ This is normal - scopes are remembered from original authorization.');
    console.warn('⚠️ If you get 403 errors, your refresh token was created WITHOUT the "streaming" scope.');
    console.warn('⚠️ Solution: Re-authorize to get a new refresh token with all scopes.');
  }
  
  return data.access_token;
}

export const handler: Handler = async (event) => {
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
    const accessToken = await getPlayerAccessToken();
    
    // Optional: Verify the token has streaming scope by checking user info
    // This helps diagnose scope issues
    try {
      const verifyResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (verifyResponse.ok) {
        console.log('✅ Token is valid and can access user info');
      } else {
        console.warn('⚠️ Token verification failed:', verifyResponse.status);
      }
    } catch (verifyError) {
      console.warn('⚠️ Could not verify token (non-critical):', verifyError);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ access_token: accessToken }),
    };
  } catch (error) {
    console.error('❌ Error getting player access token:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to get player access token',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

