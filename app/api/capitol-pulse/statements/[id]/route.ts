// API route for fetching a specific statement by ID
import { NextResponse } from 'next/server';
import { getCongressionalRecordStatements } from '@/lib/capitol-pulse/congressional-record';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const statementId = params.id;
  
  try {
    // Look up in Congressional Record statements
    const statements = await getCongressionalRecordStatements();
    const statement = statements.find(s => s.id === statementId);
    
    if (statement) {
      return NextResponse.json({ statement });
    }
    
    // Statement not found
    return NextResponse.json(
      { 
        error: "Statement not found",
        message: `Statement ${statementId} not found. It may have been from an older Congressional Record issue.`,
        statementId 
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('Statement fetch error:', error);
    return NextResponse.json(
      { 
        error: "Failed to fetch statement",
        message: "Could not retrieve Congressional Record data. Check API configuration.",
        statementId 
      },
      { status: 500 }
    );
  }
}

