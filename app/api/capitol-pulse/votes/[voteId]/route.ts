// API route for fetching a specific vote by ID
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Vote data requires integration with:
// - clerk.house.gov for House votes
// - senate.gov for Senate votes
// Congress.gov API has limited vote data

export async function GET(
  request: Request,
  { params }: { params: { voteId: string } }
) {
  const voteId = params.voteId;
  
  // TODO: Implement vote fetching
  // Parse voteId format: "119-house-123" or "119-senate-45"
  const parts = voteId.split('-');
  if (parts.length < 3) {
    return NextResponse.json(
      { error: "Invalid vote ID format", voteId },
      { status: 400 }
    );
  }
  
  // For now, return 404 since vote data requires additional integration
  return NextResponse.json(
    { 
      error: "Vote not found",
      message: "Vote data integration is pending. This feature requires House Clerk and Senate.gov data.",
      voteId 
    },
    { status: 404 }
  );
}

