'use client'

import { Header } from '@/components/layout/header'
import { MetricCards } from '@/components/dashboard/metric-cards'
import { ChartsSection } from '@/components/dashboard/charts-section'
import { RecentOccurrences } from '@/components/dashboard/recent-occurrences'
import { DateFilter } from '@/components/dashboard/date-filter'
import { useDateRangeFilter } from '@/hooks/useDateRangeFilter'

export default function Dashboard() {
  const {
    dateRange,
    updateDateRange,
    clearDateRange,
    setPresetRange
  } = useDateRangeFilter();

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Date Filter */}
        <DateFilter
          dateRange={dateRange}
          onDateRangeChange={updateDateRange}
          onPresetSelect={setPresetRange}
          onClear={clearDateRange}
        />

        {/* Metrics Cards */}
        <MetricCards dateRange={dateRange} />

        {/* Charts Section */}
        <ChartsSection dateRange={dateRange} />

        {/* Recent Occurrences */}
        <RecentOccurrences dateRange={dateRange} />
      </div>
    </div>
  )
}
