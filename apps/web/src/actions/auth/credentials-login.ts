'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

/**
 * Xử lý đăng nhập bằng email và mật khẩu
 * @param formData - Dữ liệu từ form đăng nhập
 * @returns Kết quả thành công hoặc thông báo lỗi
 */
export async function handleCredentialsLogin(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials' };
                default:
                    return { error: 'Something went wrong' };
            }
        }
        // Kiểm tra lỗi theo chuỗi nếu instance check thất bại
        if ((error as Error).message.includes('CredentialsSignin')) {
            return { error: 'Invalid credentials' };
        }
        throw error;
    }
}
