'use server';

import { AuthApi } from '@/apis/auth.api';

/**
 * Xử lý đăng ký tài khoản mới
 * @param formData - Dữ liệu từ form đăng ký
 * @returns Kết quả thành công hoặc thông báo lỗi
 */
export async function handleRegister(formData: FormData) {
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
        const result = await AuthApi.register({
            email,
            username,
            password
        });

        if (result) {
            return { success: true };
        }
        return { error: 'Registration failed' };
    } catch (error) {
        return { error: (error as Error).message || 'Registration failed' };
    }
}
