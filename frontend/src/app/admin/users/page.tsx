'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/types';
import { Users, Lock, Unlock, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map((u) => (u.id === userId || (u as any)._id === userId ? { ...u, role: newRole as any } : u)));
      alert(`Đã cập nhật vai trò thành công!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể đổi vai trò.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    setUpdatingId(userId);
    try {
      const res = await api.put(`/users/${userId}/status`);
      setUsers(users.map((u) => (u.id === userId || (u as any)._id === userId ? { ...u, isActive: res.data.isActive } : u)));
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể đổi trạng thái tài khoản.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Quản Lý Người Dùng
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Xem danh sách tài khoản, phân quyền (Admin, Seller, Buyer) và khóa/mở khóa tài khoản ({users.length})
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Đang tải danh sách người dùng...</div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Người Dùng</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Số Điện Thoại</th>
                  <th className="px-4 py-4">Vai Trò</th>
                  <th className="px-4 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const uid = u.id || (u as any)._id;
                  return (
                    <tr key={uid} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{u.name}</div>
                        {u.shop?.name && (
                          <span className="text-[10px] text-amber-600 font-semibold block">
                            Shop: {u.shop.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-700">{u.email}</td>
                      <td className="px-4 py-4">{u.phone || 'Chưa cập nhật'}</td>
                      <td className="px-4 py-4">
                        <select
                          value={u.role}
                          disabled={updatingId === uid}
                          onChange={(e) => handleRoleChange(uid, e.target.value)}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                        >
                          <option value="buyer">Buyer (Người mua)</option>
                          <option value="seller">Seller (Người bán)</option>
                          <option value="admin">Admin (Quản trị viên)</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {u.isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(uid)}
                          disabled={updatingId === uid}
                          className={`p-2 rounded-lg transition ${
                            u.isActive !== false
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={u.isActive !== false ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                        >
                          {u.isActive !== false ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-xs text-gray-400">Không có tài khoản người dùng nào.</div>
        )}
      </div>
    </div>
  );
}
