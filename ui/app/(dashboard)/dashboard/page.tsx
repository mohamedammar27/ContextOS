import { getAvailableDates, getDailyPlan } from '@/lib/api';
import { DailyPlannerClient } from '@/components/DailyPlannerClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // Get all available dates
  const availableDates = await getAvailableDates();
  
  // Determine which date to show (latest daily plan or today)
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  let selectedDate = today;
  if (availableDates?.dailyPlanDates && availableDates.dailyPlanDates.length > 0) {
    // Show the most recent daily plan
    selectedDate = availableDates.dailyPlanDates[availableDates.dailyPlanDates.length - 1];
  }
  
  // Load the plan for selected date
  const planResponse = await getDailyPlan(selectedDate);
  
  return (
    <DailyPlannerClient 
      initialPlanResponse={planResponse} 
      availableDates={availableDates}
      initialSelectedDate={selectedDate}
    />
  );
}
