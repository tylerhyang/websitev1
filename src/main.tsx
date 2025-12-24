import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Define the Spotify Web Playback SDK types
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: (SDK: any) => void;
    Spotify: any;
  }
}

// If the SDK is already loaded (script loaded before this code), set it up
if (window.Spotify) {
  // SDK already available
} else {
  // Listen for the custom event in case SDK loads after this code
  window.addEventListener('spotify-sdk-ready', ((e: CustomEvent) => {
    window.Spotify = e.detail;
  }) as EventListener);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
