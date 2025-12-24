import { Handler } from '@netlify/functions';
import { getCachedAccessToken } from './spotify-token-cache';

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
 * 
 * NOTE: This function uses the cached token to reduce API calls and rate limiting
 */
async function getPlayerAccessToken(): Promise<string> {
  // Use cached token (same token works for all endpoints)
  // The cache handles token refresh automatically
  const accessToken = await getCachedAccessToken();
  
  // Note: Scope information is not available from cached tokens
  // Scopes are remembered from the original authorization
  // If you get 403 errors, your refresh token was created WITHOUT the "streaming" scope
  // Solution: Re-authorize to get a new refresh token with all scopes
  
  return accessToken;
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
    // This helps diagnose scope issues (only on first request after cache expires)
    // Note: We skip this on cached tokens to avoid extra API calls
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

