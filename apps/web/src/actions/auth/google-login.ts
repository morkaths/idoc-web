'use server';

import { signIn } from '@/auth';

/**
 * Xử lý đăng nhập bằng Google
 */
export async function handleGoogleLogin() {
    await signIn('google', { redirectTo: '/?login=google' });
}
