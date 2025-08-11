'use client';

import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface DateFilterProps {
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onPresetSelect: (preset: string) => void;
  onClear: () => void;
}

export function DateFilter({
  dateRange,
  onDateRangeChange,
  onPresetSelect,
  onClear
}: DateFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-black">
        Filtro por Período
      </h3>
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        onPresetSelect={onPresetSelect}
        onClear={onClear}
        placeholder="Escolher período"
      />
    </div>
  );
}