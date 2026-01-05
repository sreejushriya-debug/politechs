// Server-side API route for fetching tech bills
// This keeps the Congress.gov API key secure on the server

import { NextResponse } from 'next/server';
import { fetchTechBills, checkApiHealth } from '@/lib/capitol-pulse/congress-api';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const apiHealth = await checkApiHealth();
    
    if (!apiHealth.available) {
      return NextResponse.json({
        bills: [],
        lastUpdated: new Date().toISOString(),
        source: apiHealth.message || 'API not available',
        error: true
      });
    }

    const bills = await fetchTechBills();
    
    return NextResponse.json({
      bills,
      lastUpdated: new Date().toISOString(),
      source: 'Congress.gov API',
      error: false
    });
  } catch (error) {
    console.error('Failed to fetch bills:', error);
    return NextResponse.json({
      bills: [],
      lastUpdated: new Date().toISOString(),
      source: 'Error fetching data',
      error: true
    }, { status: 500 });
  }
}

