import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/settings';

/**
 * POST /api/generate-plan
 * Proxy endpoint to trigger daily plan generation on the backend
 * Query param: ?date=YYYY-MM-DD (optional, defaults to today)
 */
export async function POST(request: NextRequest) {
  try {
    // Get dynamic backend URL
    const backendUrl = await getBaseUrl();
    
    // Get date from query params or use today
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    // Use local date instead of UTC to avoid timezone issues
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const dateStr = dateParam || today;

    // Call backend to generate plan
    const response = await fetch(
      `${backendUrl}/api/daily-plan/generate?date=${dateStr}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Generate Plan API] Backend error: ${response.status} - ${errorText}`);
      
      return NextResponse.json(
        { 
          ok: false, 
          error: `Failed to generate plan: ${response.status}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      ok: true,
      plan: data.plan,
      date: dateStr,
    });

  } catch (error) {
    console.error('[Generate Plan API] Error:', error);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Failed to generate plan' 
      },
      { status: 500 }
    );
  }
}
