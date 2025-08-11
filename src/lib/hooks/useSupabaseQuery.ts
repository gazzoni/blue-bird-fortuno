'use client'

import { useState, useEffect } from 'react'

export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await queryFn()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return { data, loading, error, refetch }
}