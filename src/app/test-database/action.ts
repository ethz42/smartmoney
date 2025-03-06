'use server';

import { createClient } from '@/libs/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export interface TestItem {
  name: string;
  description?: string;
  amount: number;
}

/**
 * 添加测试项目到数据库
 */
export async function addTestItemAction(formData: FormData) {
  try {
    const supabase = createClient();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const amount = Number.parseFloat(formData.get('amount') as string);
    
    if (!name || Number.isNaN(amount)) {
      return { 
        success: false, 
        error: '名称和金额是必填项' 
      };
    }
    
    const { data, error } = await supabase
      .from('test_items')
      .insert({
        id: uuidv4(),
        name,
        description: description || null,
        amount,
        created_at: new Date().toISOString(),
      })
      .select();
    
    if (error) {
      console.error('Error adding test item:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    // 重新验证路径，刷新数据
    revalidatePath('/test-database');
    
    return { 
      success: true, 
      data: data?.[0] 
    };
  } catch (err) {
    console.error('Error in addTestItemAction:', err);
    return { 
      success: false, 
      error: '添加数据时发生错误' 
    };
  }
}

/**
 * 获取所有测试项目
 */
export async function getAllTestItemsAction() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching test items:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: true, 
      data: data || [] 
    };
  } catch (err) {
    console.error('Error in getAllTestItemsAction:', err);
    return { 
      success: false, 
      error: '获取数据时发生错误' 
    };
  }
}

/**
 * 根据 ID 获取测试项目
 */
export async function getTestItemByIdAction(id: string) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching test item with id ${id}:`, error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: true, 
      data 
    };
  } catch (err) {
    console.error('Error in getTestItemByIdAction:', err);
    return { 
      success: false, 
      error: '获取数据时发生错误' 
    };
  }
}

/**
 * 更新测试项目
 */
export async function updateTestItemAction(id: string, formData: FormData) {
  try {
    const supabase = createClient();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const amount = Number.parseFloat(formData.get('amount') as string);
    
    if (!name || Number.isNaN(amount)) {
      return { 
        success: false, 
        error: '名称和金额是必填项' 
      };
    }
    
    const { data, error } = await supabase
      .from('test_items')
      .update({
        name,
        description: description || null,
        amount,
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating test item with id ${id}:`, error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    // 重新验证路径，刷新数据
    revalidatePath('/test-database');
    
    return { 
      success: true, 
      data: data?.[0] 
    };
  } catch (err) {
    console.error('Error in updateTestItemAction:', err);
    return { 
      success: false, 
      error: '更新数据时发生错误' 
    };
  }
}

/**
 * 删除测试项目
 */
export async function deleteTestItemAction(id: string) {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('test_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting test item with id ${id}:`, error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    // 重新验证路径，刷新数据
    revalidatePath('/test-database');
    
    return { 
      success: true 
    };
  } catch (err) {
    console.error('Error in deleteTestItemAction:', err);
    return { 
      success: false, 
      error: '删除数据时发生错误' 
    };
  }
} 