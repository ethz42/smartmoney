'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  addTestItemAction, 
  getAllTestItemsAction, 
  deleteTestItemAction,
  type TestItem 
} from './action';

interface DatabaseItem extends TestItem {
  id: string;
  created_at: string;
}

export default function TestDatabaseServerActionPage() {
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载所有测试项目
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllTestItemsAction();
      if (result.success) {
        setItems(result.data as DatabaseItem[]);
      } else {
        setError(result.error || '加载数据失败');
      }
    } catch (err) {
      setError('加载数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // 处理表单提交
  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await addTestItemAction(formData);
      if (result.success) {
        // 重置表单
        const form = document.getElementById('add-form') as HTMLFormElement;
        form?.reset();
        // 重新加载列表
        await loadItems();
      } else {
        setError(result.error || '添加数据失败');
      }
    } catch (err) {
      setError('添加数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 删除项目
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个项目吗？')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteTestItemAction(id);
      if (result.success) {
        await loadItems(); // 重新加载列表
      } else {
        setError(result.error || '删除数据失败');
      }
    } catch (err) {
      setError('删除数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">数据库测试 (Server Actions)</h1>
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 添加表单 */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">添加测试项目</h2>
        <form id="add-form" action={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              名称
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              描述
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              金额
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              name="amount"
              step="0.01"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? '处理中...' : '添加'}
            </button>
          </div>
        </form>
      </div>
      
      {/* 数据列表 */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4">测试项目列表</h2>
        
        {loading && <p>加载中...</p>}
        
        {!loading && items.length === 0 && (
          <p className="text-gray-500">暂无数据</p>
        )}
        
        {!loading && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    名称
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    描述
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                      {item.id.substring(0, 8)}...
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                      {item.name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                      {item.description || '-'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                      {item.amount}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 mr-2"
                        type="button"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={loadItems}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
            type="button"
          >
            刷新数据
          </button>
        </div>
      </div>
    </div>
  );
} 