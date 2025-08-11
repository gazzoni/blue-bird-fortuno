'use client'

import { Header } from '@/components/layout/header'
import { MetricCards } from '@/components/dashboard/metric-cards'
import { ChartsSection } from '@/components/dashboard/charts-section'
import { RecentOccurrences } from '@/components/dashboard/recent-occurrences'

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Metrics Cards */}
        <MetricCards />

        {/* Charts Section */}
        <ChartsSection />

        {/* Recent Occurrences */}
        <RecentOccurrences />
      </div>
    </div>
  )
}
