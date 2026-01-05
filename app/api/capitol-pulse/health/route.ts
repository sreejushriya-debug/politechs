// Server-side API route for checking API health
// This verifies the Congress.gov API key is working

import { NextResponse } from 'next/server';
import { checkApiHealth } from '@/lib/capitol-pulse/congress-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const health = await checkApiHealth();
    
    return NextResponse.json({
      available: health.available,
      message: health.message,
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.CONGRESS_API_KEY
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      available: false,
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.CONGRESS_API_KEY
    }, { status: 500 });
  }
}

