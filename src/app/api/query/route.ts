// app/api/query/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { executeFullProcess } from '@/libs/dune'

export async function POST(request: NextRequest) {
  try {
    // 1. 获取请求体
    const body = await request.json()

    // 2. 打印到控制台
    console.log('Request body:', body)

    // console.log('Environment Variables:', process.env); // 调试日志
    const { contractAddress } = body
    console.log(contractAddress)
    console.log('contractAddress runtime type:', typeof contractAddress);

    // 从环境变量获取配置
    const queryId = process.env.QUERY_ID ?? ''
    const apiKey = process.env.DUNE_API_KEY ?? ''
    console.log(queryId)
    console.log(apiKey)


    if (!queryId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing QUERY_ID or DUNE_API_KEY in environment variables' },
        { status: 500 }
      )
    }
    // 执行完整查询流程
    const results = await executeFullProcess(queryId, apiKey, contractAddress)
    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}