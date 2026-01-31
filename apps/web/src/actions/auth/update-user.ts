'use server';

import { AuthApi } from '@/apis/auth.api';
import { User } from '@/types';

/**
 * Cập nhật thông tin người dùng
 * @param data - Thông tin cần cập nhật
 * @returns Kết quả thành công cùng dữ liệu mới hoặc thông báo lỗi
 */
export async function updateUser(data: Partial<User>) {
    try {
        const result = await AuthApi.update(data);
        if (result) {
            return { success: true, data: result };
        }
        return { error: 'Update failed' };
    } catch (error) {
        return { error: (error as Error).message || 'Update failed' };
    }
}
