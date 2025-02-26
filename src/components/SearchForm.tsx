'use client'

import { useState } from 'react'
import type { SearchResult } from '@/types/core/search';

// interface SearchResult {
//   rows: Array<unknown>;
// }

interface SearchFormProps {
  onSearchStart: () => void
  onSearchComplete: (data: SearchResult) => void
  onSearchError: (message: string) => void
}

export default function SearchForm({
  onSearchStart,
  onSearchComplete,
  onSearchError
}: SearchFormProps) {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    try {
      if (!inputValue.trim()) {
        onSearchError('Please enter a valid contract address')
        return
      }

      setIsLoading(true)
      onSearchStart()

      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAddress: inputValue })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      const { data } = await response.json()
      onSearchComplete(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data'
      onSearchError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter contract address (0x...)"
          className="flex-1 p-3 bg-gray-800/50 border border-gray-500/30 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
          disabled={isLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-3 bg-purple-500/90 hover:bg-purple-500 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>
      
      <p className="text-sm text-gray-400 text-left">
        Example: 0x1a2b3c4d... or ENS name (vitalik.eth)
      </p>
    </div>
  )
}