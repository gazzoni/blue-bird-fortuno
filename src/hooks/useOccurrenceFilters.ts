'use client';

import { useState, useMemo } from 'react';

export interface Occurrence {
  id: number;
  justification: string;
  evidence: string;
  keywords: string;
  chatType: string;
  chatId: string;
  chatName: string;
  channel: string;
  status: string;
  category: string;
  createdAt: string;
}

export interface FilterState {
  search: string;
  status: string;
  category: string;
  chatType: string;
}

export function useOccurrenceFilters(occurrences: Occurrence[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    category: 'all',
    chatType: 'all'
  });

  const filteredOccurrences = useMemo(() => {
    return occurrences.filter((occurrence) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          occurrence.justification.toLowerCase().includes(searchTerm) ||
          occurrence.chatName.toLowerCase().includes(searchTerm) ||
          occurrence.keywords.toLowerCase().includes(searchTerm) ||
          occurrence.category.toLowerCase().includes(searchTerm) ||
          occurrence.evidence.toLowerCase().includes(searchTerm);
        
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

      // Chat type filter
      if (filters.chatType !== 'all' && occurrence.chatType !== filters.chatType) {
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
      chatType: 'all'
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' || 
           filters.status !== 'all' || 
           filters.category !== 'all' || 
           filters.chatType !== 'all';
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