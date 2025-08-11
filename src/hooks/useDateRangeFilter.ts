'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export function useDateRangeFilter() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    // Default to last 7 days
    const today = new Date();
    const weekAgo = subDays(today, 7);
    return {
      from: weekAgo,
      to: today
    };
  });

  const updateDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const clearDateRange = () => {
    setDateRange(undefined);
  };

  // Helper function to check if a date is within the selected range
  const isDateInRange = (date: string | Date): boolean => {
    if (!dateRange?.from || !dateRange?.to) {
      return true; // If no range selected, show all data
    }

    const targetDate = typeof date === 'string' ? new Date(date) : date;
    
    return isWithinInterval(targetDate, {
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to)
    });
  };

  // Helper function to filter data by date range
  const filterByDateRange = <T extends { created_at?: string; createdAt?: string; date?: string }>(
    data: T[]
  ): T[] => {
    if (!dateRange?.from || !dateRange?.to) {
      return data;
    }

    return data.filter(item => {
      const itemDate = item.created_at || item.createdAt || item.date;
      return itemDate ? isDateInRange(itemDate) : false;
    });
  };

  // Preset date ranges
  const presetRanges = {
    today: {
      from: new Date(),
      to: new Date()
    },
    yesterday: {
      from: subDays(new Date(), 1),
      to: subDays(new Date(), 1)
    },
    last7Days: {
      from: subDays(new Date(), 7),
      to: new Date()
    },
    last30Days: {
      from: subDays(new Date(), 30),
      to: new Date()
    },
    last90Days: {
      from: subDays(new Date(), 90),
      to: new Date()
    }
  };

  const setPresetRange = (preset: string) => {
    const presetKey = preset as keyof typeof presetRanges;
    if (presetKey in presetRanges) {
      setDateRange(presetRanges[presetKey]);
    }
  };

  return {
    dateRange,
    updateDateRange,
    clearDateRange,
    isDateInRange,
    filterByDateRange,
    setPresetRange,
    presetRanges
  };
}