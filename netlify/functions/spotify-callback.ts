import { Handler } from '@netlify/functions';

/**
 * OAuth callback handler for Spotify
 * This function exchanges the authorization code for a refresh token
 * 
 * Usage:
 * 1. Visit: https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=user-read-recently-played%20user-top-read
 * 2. Authorize the app
 * 3. You'll be redirected here with a code
 * 4. This function will exchange it for tokens and display the refresh token
 */
export const handler: Handler = async (event) => {
  const code = event.queryStringParameters?.code;
  const error = event.queryStringParameters?.error;

  if (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <html>
          <head><title>Spotify Authorization Error</title></head>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1>Authorization Error</h1>
            <p>Error: ${error}</p>
            <p>Please try again.</p>
          </body>
        </html>
      `,
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <html>
          <head><title>Spotify Authorization</title></head>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1>No Authorization Code</h1>
            <p>No code parameter found in the URL.</p>
            <p>Make sure you're being redirected from Spotify after authorization.</p>
          </body>
        </html>
      `,
    };
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || event.headers['x-forwarded-proto'] + '://' + event.headers.host + event.path;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <html>
          <head><title>Configuration Error</title></head>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1>Configuration Error</h1>
            <p>SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not configured.</p>
            <p>Please set these environment variables in Netlify.</p>
          </body>
        </html>
      `,
    };
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/html',
        },
        body: `
          <html>
            <head><title>Token Exchange Error</title></head>
            <body style="font-family: sans-serif; padding: 20px;">
              <h1>Token Exchange Failed</h1>
              <p>Error: ${data.error_description || data.error}</p>
              <pre style="background: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
            </body>
          </html>
        `,
      };
    }

    // Display the refresh token (user will copy this)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <html>
          <head>
            <title>Spotify Authorization Success</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                line-height: 1.6;
              }
              .success {
                background: #1DB954;
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .token-box {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 5px;
                border: 2px solid #1DB954;
                font-family: monospace;
                word-break: break-all;
                margin: 20px 0;
              }
              .instructions {
                background: #fff3cd;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #ffc107;
                margin-top: 20px;
              }
              .button {
                display: inline-block;
                background: #1DB954;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="success">
              <h1>✅ Authorization Successful!</h1>
              <p>Your Spotify account has been authorized.</p>
            </div>
            
            <h2>Your Refresh Token:</h2>
            <div class="token-box" id="token">${data.refresh_token}</div>
            <button class="button" onclick="copyToken()">Copy Token</button>
            
            <div class="instructions">
              <h3>Next Steps:</h3>
              <ol>
                <li>Copy the refresh token above</li>
                <li>Go to your Netlify site dashboard</li>
                <li>Navigate to <strong>Site settings</strong> → <strong>Environment variables</strong></li>
                <li>Add or update <code>SPOTIFY_REFRESH_TOKEN</code> with the token above</li>
                <li>Redeploy your site (or wait for the next deployment)</li>
              </ol>
            </div>

            <script>
              function copyToken() {
                const token = document.getElementById('token').textContent;
                navigator.clipboard.writeText(token).then(() => {
                  alert('Token copied to clipboard!');
                });
              }
            </script>
          </body>
        </html>
      `,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <html>
          <head><title>Server Error</title></head>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1>Server Error</h1>
            <p>An error occurred while exchanging the token:</p>
            <pre style="background: #f0f0f0; padding: 10px; border-radius: 5px;">${error instanceof Error ? error.message : 'Unknown error'}</pre>
          </body>
        </html>
      `,
    };
  }
};

