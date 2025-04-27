'use client'

import { useState } from 'react'
import type { SearchResult } from '@/types/core/search';
import { saveSearchResultAction } from '@/app/api/action';

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

      // 尝试从数据库获取缓存数据或从 API 获取新数据
      const saveResult = await saveSearchResultAction(inputValue, { rows: [], metadata: { column_names: [] } });
      
      // 如果从数据库获取到了缓存数据
      if (saveResult.success && saveResult.data && saveResult.data.fromCache) {
        console.log('Using cached results from database');
        // 使用缓存数据
        const cachedData = {
          rows: saveResult.data.rows,
          metadata: saveResult.data.metadata
        };
        onSearchComplete(cachedData);
        setIsLoading(false);
        return;
      }
      
      // 如果没有缓存数据，从 API 获取新数据
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
      
      // 保存新数据到数据库
      const updateResult = await saveSearchResultAction(inputValue, data);
      if (!updateResult.success) {
        console.warn('Failed to save search results to database:', updateResult.error);
      } else {
        console.log('Search results saved to database');
      }
      
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
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter contract address (0x...)"
            className="w-full p-4 bg-gray-800/50 border border-gray-600/30 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-100 placeholder-gray-400 outline-none transition-all duration-200 shadow-lg"
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isLoading}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Example: 0x1a2b3c4d... or ENS name (vitalik.eth)</p>
      </div>
    </div>
  )
}