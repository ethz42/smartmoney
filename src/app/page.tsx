import { Search, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      {/* Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">

                {/* <span className="text-[#7FFFD4] font-semibold">PUMP.NEWS</span> */}
              </Link>
              {/* <div className="hidden md:flex items-center space-x-6">
                <Link href="/search" className="text-gray-300 hover:text-white">
                  Search
                </Link>
                <Link href="/trending" className="text-gray-300 hover:text-white">
                  Trending
                </Link>
                <Link href="/trench" className="text-gray-300 hover:text-white">
                  Trench
                </Link>
                <Link href="/feeds" className="text-gray-300 hover:text-white">
                  Feeds
                </Link>
                <Link href="/watchlist" className="text-gray-300 hover:text-white">
                  Watchlist
                </Link>
              </div> */}
            </div>
            <div className="flex items-center space-x-4">
              {/* <Button variant="ghost" className="text-[#7FFFD4] hover:text-[#7FFFD4]/80">
                Become PRO
              </Button> */}
              {/* <Button variant="outline" className="text-gray-300">
                Log in
              </Button>
              <select className="bg-transparent border border-gray-800 rounded px-2 py-1">
                <option value="SOL">SOL</option>
                <option value="ETH">ETH</option>
              </select> */}
              {/* <select className="bg-transparent border border-gray-800 rounded px-2 py-1">
                <option value="En">En</option>
              </select> */}
            </div>
          </div>
        </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Logo */}
          <div className="space-y-4">
            
            <h1 className="text-2xl text-gray-300">Your Smart Money Radar for Meme Coins</h1>
          </div>

          {/* Search */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search CA or Ticker"
                className="w-full bg-gray-900/50 border-gray-800 pl-12 h-12 rounded-lg"
              />
            </div>
            <div className="flex items-center justify-center space-x-4">
              <Button className="bg-[#1e3a3a] hover:bg-[#1e3a3a]/80 text-[#7FFFD4]">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="link" className="text-[#7FFFD4]">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending
              </Button>
            </div>
          </div>

          {/* Coin Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* {["ZEREBRO", "arc", "BULLY", "CHILLGUY", "GRIFFAIN"].map((coin) => (
              <div
                key={coin}
                className="bg-gray-900/30 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-800 rounded-full" />
                  <div className="text-left">
                    <div className="font-medium">{coin}</div>
                    <div className="text-xs text-gray-500">8x5Vq...2Wn</div>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </main>
    </div>
  )
}

