import { NextRequest, NextResponse } from 'next/server';
import { searchSpotify } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const results = await searchSpotify(query, limit);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Spotify search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
