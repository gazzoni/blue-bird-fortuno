'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onPresetSelect?: (preset: string) => void;
  onClear?: () => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  onPresetSelect,
  onClear,
  className,
  placeholder = 'Selecionar período'
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    onDateRangeChange?.(range);
    // Close popover if both dates are selected
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onClear?.();
    setIsOpen(false);
  };

  const handlePresetSelect = (preset: string) => {
    onPresetSelect?.(preset);
    setIsOpen(false);
  };

  const formatDateRange = (range: DateRange) => {
    if (range.from && range.to) {
      return `${format(range.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(range.to, 'dd/MM/yyyy', { locale: ptBR })}`;
    } else if (range.from) {
      return format(range.from, 'dd/MM/yyyy', { locale: ptBR });
    }
    return '';
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'justify-start text-left font-normal border-gray-300 hover:bg-gray-50',
              !dateRange && 'text-gray-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? (
              <span>{formatDateRange(dateRange)}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Preset buttons sidebar */}
            <div className="border-r border-gray-200 p-4">
              <div className="space-y-2 min-w-[120px]">
                <h4 className="text-sm font-medium text-black mb-3">
                  Períodos rápidos
                </h4>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetSelect('today')}
                    className="w-full justify-start text-xs text-gray-700 hover:text-black hover:bg-gray-100"
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetSelect('yesterday')}
                    className="w-full justify-start text-xs text-gray-700 hover:text-black hover:bg-gray-100"
                  >
                    Ontem
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetSelect('last7Days')}
                    className="w-full justify-start text-xs text-gray-700 hover:text-black hover:bg-gray-100"
                  >
                    Últimos 7 dias
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetSelect('last30Days')}
                    className="w-full justify-start text-xs text-gray-700 hover:text-black hover:bg-gray-100"
                  >
                    Últimos 30 dias
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetSelect('last90Days')}
                    className="w-full justify-start text-xs text-gray-700 hover:text-black hover:bg-gray-100"
                  >
                    Últimos 90 dias
                  </Button>
                </div>
                
                {/* Clear button */}
                {dateRange && (
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="w-full justify-start text-xs text-gray-600 hover:text-black"
                    >
                      <RotateCcw className="w-3 h-3 mr-2" />
                      Limpar filtro
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Calendar */}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleSelect}
              numberOfMonths={2}
              locale={ptBR}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}