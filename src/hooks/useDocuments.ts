import { useQuery } from '@tanstack/react-query'
import { getDocuments, getUsage } from '@/lib/documentsApi'

export function useDocuments(page = 1) {
  return useQuery({
    queryKey: ['documents', page],
    queryFn: () => getDocuments(page),
  })
}

export function useUsage() {
  return useQuery({
    queryKey: ['usage'],
    queryFn: getUsage,
  })
}
