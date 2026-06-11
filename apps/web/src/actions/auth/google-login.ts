'use server';

import { signIn } from '@/auth';

/**
 * Xử lý đăng nhập bằng Google
 * @param redirectTo - Đường dẫn chuyển hướng sau khi đăng nhập thành công
 */
export async function handleGoogleLogin() {
  await signIn('google', { redirectTo: '/?login=google' });
}
