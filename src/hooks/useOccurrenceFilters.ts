'use client';

import { useState, useMemo } from 'react';

export interface Occurrence {
  id: number;
  occurrenceName: string;
  description: string;
  occurrenceResolution: string;
  keywords: string;
  chatId: string;
  chatName: string;
  clientName: string;
  channel: string;
  status: string;
  category: string;
  squad: string;
  gateKepper: boolean;
  messages: Record<string, unknown>;
  createdAt: string;
}

export interface FilterState {
  search: string;
  status: string;
  category: string;
  squad: string;
}

export function useOccurrenceFilters(occurrences: Occurrence[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    category: 'all',
    squad: 'all'
  });

  const filteredOccurrences = useMemo(() => {
    return occurrences.filter((occurrence) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          occurrence.occurrenceName.toLowerCase().includes(searchTerm) ||
          occurrence.description.toLowerCase().includes(searchTerm) ||
          occurrence.chatName.toLowerCase().includes(searchTerm) ||
          occurrence.keywords.toLowerCase().includes(searchTerm) ||
          occurrence.category.toLowerCase().includes(searchTerm) ||
          occurrence.clientName.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && occurrence.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && occurrence.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }

      // Squad filter
      if (filters.squad !== 'all' && occurrence.squad !== filters.squad) {
        return false;
      }

      return true;
    });
  }, [occurrences, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      squad: 'all'
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' || 
           filters.status !== 'all' || 
           filters.category !== 'all' || 
           filters.squad !== 'all';
  }, [filters]);

  return {
    filters,
    filteredOccurrences,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    totalCount: occurrences.length,
    filteredCount: filteredOccurrences.length
  };
}