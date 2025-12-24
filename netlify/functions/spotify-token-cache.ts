/**
 * Shared token cache for Spotify access tokens
 * Tokens are cached in memory to reduce API calls to Spotify's token endpoint
 * 
 * Note: In Netlify Functions, module-level variables persist across warm invocations
 * but are reset on cold starts. This is fine as tokens expire in 1 hour anyway.
 */

interface CachedToken {
  token: string;
  expiresAt: number; // Timestamp in milliseconds
}

let tokenCache: CachedToken | null = null;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

/**
 * Get a cached access token or fetch a new one if expired
 * Tokens are cached for 55 minutes (they expire in 1 hour)
 */
export async function getCachedAccessToken(): Promise<string> {
  const now = Date.now();
  
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.token;
  }

  // Fetch new token
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
  const accessToken = data.access_token;
  
  // Cache the token for 55 minutes (tokens expire in 1 hour, so we refresh early)
  // Convert expires_in (seconds) to milliseconds, subtract 5 minutes for safety
  const expiresIn = (data.expires_in || 3600) * 1000; // Default to 1 hour if not provided
  const cacheDuration = expiresIn - (5 * 60 * 1000); // Subtract 5 minutes
  
  tokenCache = {
    token: accessToken,
    expiresAt: now + cacheDuration,
  };

  return accessToken;
}

/**
 * Clear the token cache (useful for testing or forced refresh)
 */
export function clearTokenCache(): void {
  tokenCache = null;
}

