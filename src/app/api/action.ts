'use server';

import { createClient } from '@/libs/supabase/client';
import { revalidatePath } from 'next/cache';
import type { SearchResult } from '@/types/core/search';

/**
 * 将搜索结果保存到数据库
 */
export async function saveSearchResultAction(contractAddress: string, searchResult: SearchResult) {
  try {
    const supabase = createClient();
    
    // 1. 检查是否有最近 24 小时内的查询结果
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const { data: cachedResults, error: cacheError } = await supabase
      .from('smart_money_stats')
      .select('*')
      .eq('contract_address', contractAddress)
      .gte('updated_at', twentyFourHoursAgo.toISOString());
    
    // 如果有缓存结果，直接返回
    if (cachedResults && cachedResults.length > 0 && !cacheError) {
      console.log('Using cached results from database');
      return { 
        success: true, 
        data: { 
          rows: cachedResults,
          metadata: searchResult.metadata,
          fromCache: true
        } 
      };
    }
    
    // 2. 如果没有缓存或缓存已过期，保存新结果
    const rowsToInsert = searchResult.rows.map(row => ({
      address: row.address,
      avg_buy_price: row.avg_buy_price,
      price_threshold: row.price_threshold,
      realized_multiple: row.realized_multiple,
      realized_pnl_usd: row.realized_pnl_usd,
      total_bought_amount: row.total_bought_amount,
      total_buy_usd: row.total_buy_usd,
      total_sell_usd: row.total_sell_usd,
      total_trades: row.total_trades,
      contract_address: contractAddress, // 添加合约地址
      updated_at: new Date().toISOString() // 添加更新时间
    }));
    
    // 使用 upsert 操作，如果记录已存在则更新
    const { error } = await supabase
      .from('smart_money_stats')
      .upsert(rowsToInsert, { 
        onConflict: 'address',  // 以 address 字段为唯一标识
        ignoreDuplicates: false // 如果记录已存在，则更新它
      });
    
    if (error) {
      console.error('Error saving to smart_money_stats:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    // 可选：将合约地址和描述保存到 smart_money_ai_descriptions 表
    // 如果您有描述信息的话
    /*
    const { error: descError } = await supabase
      .from('smart_money_ai_descriptions')
      .upsert({
        smart_money_address: contractAddress,
        description: '这是一个自动生成的描述', // 这里可以放置 AI 生成的描述
        created_at: new Date().toISOString()
      }, { 
        onConflict: 'smart_money_address' 
      });
    
    if (descError) {
      console.error('Error saving to smart_money_ai_descriptions:', descError);
      // 这里我们不返回错误，因为主要数据已经保存成功
    }
    */
    
    // 重新验证路径，刷新数据
    revalidatePath('/');
    
    return { 
      success: true, 
      data: { 
        rows: searchResult.rows,
        metadata: searchResult.metadata,
        fromCache: false
      } 
    };
  } catch (err) {
    console.error('Error in saveSearchResultAction:', err);
    return { 
      success: false, 
      error: '保存数据时发生错误' 
    };
  }
}

/**
 * 获取 AI 对交易者的分析
 */
export async function getTraderAnalysisAction(address: string) {
  try {
    const supabase = createClient();
    
    // 1. 首先检查是否已有分析结果
    const { data: existingDesc, error: descError } = await supabase
      .from('smart_money_ai_descriptions')
      .select('description, created_at')
      .eq('smart_money_address', address)
      .single();
    
    // 如果已有分析且不超过 7 天，直接返回
    if (existingDesc && !descError) {
      const createdAt = new Date(existingDesc.created_at);
      const now = new Date();
      const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays < 7) {
        return {
          success: true,
          data: {
            description: existingDesc.description,
            isFromCache: true
          }
        };
      }
    }
    
    // 2. 获取交易记录
    const { data: tradeRecords, error: tradeError } = await supabase
      .from('smart_money_stats')
      .select('*')
      .eq('address', address)
      .single();
    
    if (tradeError) {
      console.error('Error fetching trade records:', tradeError);
      return { 
        success: false, 
        error: '获取交易记录失败' 
      };
    }
    // 3. 调用 AI API 进行分析
    const aiQuery = `evaluate this trader within 110 words: ${JSON.stringify(tradeRecords)}`;
    
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [{ role: "user", content: aiQuery }],
        stream: false,
        max_tokens: 500,
        temperature: 0.2,
        top_p: 0.5,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
        response_format: { type: "text" },
      })
    };
    
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', options);
    
    if (!response.ok) {
      throw new Error(`AI API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // 4. 保存分析结果到数据库
    const { error: saveError } = await supabase
      .from('smart_money_ai_descriptions')
      .upsert({
        smart_money_address: address,
        description: content,
        created_at: new Date().toISOString()
      }, { 
        onConflict: 'smart_money_address' 
      });
    
    if (saveError) {
      console.error('Error saving AI description:', saveError);
      // 即使保存失败，我们仍然返回分析结果
    }
    
    return {
      success: true,
      data: {
        description: content,
        isFromCache: false
      }
    };
    
  } catch (err) {
    console.error('Error in getTraderAnalysisAction:', err);
    return { 
      success: false, 
      error: '获取分析失败' 
    };
  }
}
