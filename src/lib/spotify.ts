// Spotify Client Credentials Flow

let accessToken: string | null = null;
let tokenExpiry: number = 0;

export async function getSpotifyToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // 1분 여유
  return accessToken!;
}

export async function searchSpotify(query: string, limit = 20) {
  const token = await getSpotifyToken();
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    market: 'KR',
    limit: String(limit),
  });

  const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Spotify search failed');
  const data = await res.json();

  return data.tracks.items.map((track: any) => ({
    spotifyId: track.id,
    title: track.name,
    artist: track.artists.map((a: any) => a.name).join(', '),
    albumName: track.album.name,
    albumArtUrl: track.album.images[0]?.url || '',
    previewUrl: track.preview_url,
    genre: '',
    durationMs: track.duration_ms,
  }));
}

export async function getSpotifyTrack(trackId: string) {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}?market=KR`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Spotify track fetch failed');
  const track = await res.json();

  return {
    spotifyId: track.id,
    title: track.name,
    artist: track.artists.map((a: any) => a.name).join(', '),
    albumName: track.album.name,
    albumArtUrl: track.album.images[0]?.url || '',
    previewUrl: track.preview_url,
    genre: '',
    durationMs: track.duration_ms,
  };
}
