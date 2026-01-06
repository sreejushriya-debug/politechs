import { NextResponse } from 'next/server';
import { getCongressionalRecordStatements } from '@/lib/capitol-pulse/congressional-record';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[Statements API] Fetching statements...');
    const statements = await getCongressionalRecordStatements();
    console.log('[Statements API] Got', statements.length, 'statements');
    
    return NextResponse.json({
      statements,
      total: statements.length,
      lastUpdated: new Date().toISOString(),
      source: 'Congress.gov (Bill Summaries + Hearings)'
    });
  } catch (error) {
    console.error('[Statements API] Error:', error);
    return NextResponse.json({
      statements: [],
      total: 0,
      lastUpdated: new Date().toISOString(),
      source: 'Error fetching statements',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

