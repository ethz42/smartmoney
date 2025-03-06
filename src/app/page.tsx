'use client';
import SearchForm from "@/components/SearchForm"
import ResultsTable from "@/components/ResultsTable"
import TraderAnalysis from "@/components/TraderAnalysis"
import { useState } from 'react'
import type { SearchResult } from "@/types/core/search";

// interface SearchResult {
//   rows: Array<Record<string, unknown>>;
//   // ... other fields ...
// }

export default function Page() {
  // 状态管理
  const [searchData, setSearchData] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  // 处理搜索完成回调
  const handleSearchComplete = (data: SearchResult) => {
    setSearchData(data)
    setIsLoading(false)
    setError(null)
    setSelectedAddress(null) // 重置选中的地址
    
    // 检查数据是否来自缓存
    setIsFromCache('fromCache' in data && data.fromCache === true)
  }

  // 处理搜索错误
  const handleSearchError = (message: string) => {
    setError(message)
    setIsLoading(false)
  }

  // 处理选择地址
  const handleSelectAddress = (address: string) => {
    setSelectedAddress(address)
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      <div className="container mx-auto px-4">
        {/* Header 部分保持不变 */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <h2 className="text-xl font-bold">MemeRadar</h2>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Your Smart Money Radar
            </h1>
            <p className="text-xl text-gray-300">Track meme coins in real-time</p>
          </div>

          {/* 搜索区域 */}
          <div className="space-y-8">
            <SearchForm 
              onSearchStart={() => {
                setIsLoading(true)
                setError(null)
              }}
              onSearchComplete={handleSearchComplete}
              onSearchError={handleSearchError}
            />
            
            {/* 状态展示区域 */}
            {isLoading && (
              <div className="py-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-1/4"> </div>
                  <div className="h-8 bg-gray-800 rounded"> </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-800/30 rounded-lg border border-red-600/50 text-red-300">
                ⚠️ {error}
              </div>
            )}

            {/* 结果展示区域 - 使用两列布局 */}
            {searchData && (
              <div className="text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-mono text-gray-400">
                    📊 Found {searchData.rows.length} address
                  </h3>
                  
                  {isFromCache && (
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      ⚡ Using cached data (less than 24h old)
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 左侧表格 - 占据 2/3 */}
                  <div className="lg:col-span-2 border border-gray-700/50 rounded-xl overflow-hidden">
                    <ResultsTable 
                      data={searchData}
                      className="bg-gray-900/30"
                      onSelectAddress={handleSelectAddress}
                    />
                  </div>
                  
                  {/* 右侧分析面板 - 占据 1/3 */}
                  <div className="border border-gray-700/50 rounded-xl overflow-hidden h-[600px]">
                    <TraderAnalysis address={selectedAddress} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}