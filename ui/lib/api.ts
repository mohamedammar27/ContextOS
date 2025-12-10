/**
 * API helper functions for ContextOS Daily Planner
 * Connects Next.js frontend to Express backend
 */

import { getBaseUrl } from './settings';

interface Task {
  taskNumber: number;
  title: string;
  completed?: boolean;
}

interface FocusTask extends Task {
  reason: string;
}

interface DailyPlan {
  date: string;
  daySummary: string;
  focusTasks: FocusTask[];
  otherTasks: Task[];
  reminders: string[];
  scheduleSuggestions: Array<{
    timeOfDay: string;
    suggestion: string;
  }>;
  totalTasks: number;
}

interface DailyPlanResponse {
  exists: boolean;
  plan?: DailyPlan;
}

export type { DailyPlan, DailyPlanResponse, Task, FocusTask };

/**
 * Get the backend URL dynamically from settings
 * Falls back to default localhost:8000 if not configured
 */
async function getBackendUrl(): Promise<string> {
  try {
    return await getBaseUrl();
  } catch (error) {
    console.error('Error loading backend URL from settings, using default:', error);
    return 'http://localhost:8000';
  }
}

/**
 * Capture context manually (same as extension capture)
 * @param content - The text content to capture
 * @returns Response indicating success or failure
 */
export async function captureContext(content: string): Promise<{ ok: boolean; error?: string; ignored?: boolean }> {
  try {
    const backendUrl = await getBackendUrl();
    const response = await fetch(`${backendUrl}/api/context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'manual',
        content: content,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { ok: false, error: error.error || 'Failed to capture context' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error capturing context:', error);
    return { ok: false, error: 'Network error' };
  }
}

/**
 * Fetch a daily plan for a specific date
 * @param dateStr - Date in YYYY-MM-DD format
 * @returns DailyPlanResponse with plan data or exists:false
 */
export async function getDailyPlan(dateStr: string): Promise<DailyPlanResponse | null> {
  try {
    const backendUrl = await getBackendUrl();
    const response = await fetch(
      `${backendUrl}/api/daily-plan?date=${dateStr}`,
      {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`[API] Failed to fetch daily plan: ${response.status}`);
      return null;
    }

    const data: DailyPlanResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Error fetching daily plan:', error);
    return null;
  }
}

/**
 * Fetch today's daily plan
 * Automatically uses current date in YYYY-MM-DD format (local timezone)
 * @returns DailyPlanResponse with plan data or exists:false
 */
export async function getTodayPlan(): Promise<DailyPlanResponse | null> {
  const now = new Date();
  // Use local date instead of UTC to avoid timezone issues
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return getDailyPlan(dateStr);
}

/**
 * Generate a new daily plan for a specific date
 * @param dateStr - Date in YYYY-MM-DD format
 * @returns Generated plan or null on failure
 */
export async function generateDailyPlan(dateStr: string): Promise<DailyPlan | null> {
  try {
    const backendUrl = await getBackendUrl();
    const response = await fetch(
      `${backendUrl}/api/daily-plan/generate?date=${dateStr}`,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`[API] Failed to generate daily plan: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.ok ? data.plan : null;
  } catch (error) {
    console.error('[API] Error generating daily plan:', error);
    return null;
  }
}

/**
 * Get available dates with processed data and daily plans
 * @returns Object with arrays of dates and generation status
 */
export async function getAvailableDates() {
  try {
    const backendUrl = await getBackendUrl();
    const response = await fetch(
      `${backendUrl}/api/daily-plan/available-dates`,
      {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`[API] Failed to get available dates: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[API] Error getting available dates:', error);
    return null;
  }
}

/**
 * Generate daily plans for all dates with processed data but no plan
 * @returns Result with list of generated plans
 */
export async function generateMissingPlans() {
  try {
    const backendUrl = await getBackendUrl();
    const response = await fetch(
      `${backendUrl}/api/daily-plan/generate-missing`,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`[API] Failed to generate missing plans: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[API] Error generating missing plans:', error);
    return null;
  }
}

/**
 * Toggle task completion status
 * @param taskId - Task number to update
 * @param completed - New completion status
 * @param date - Date of the plan (YYYY-MM-DD)
 * @returns Updated plan or null on failure
 */
export async function toggleTaskCompletion(
  taskId: number,
  completed: boolean,
  date: string
): Promise<DailyPlan | null> {
  try {
    const backendUrl = await getBackendUrl();
    const response = await fetch(
      `${backendUrl}/api/tasks/${taskId}`,
      {
        method: 'PATCH',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed, date }),
      }
    );

    if (!response.ok) {
      console.error(`[API] Failed to toggle task completion: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.ok ? data.plan : null;
  } catch (error) {
    console.error('[API] Error toggling task completion:', error);
    return null;
  }
}
