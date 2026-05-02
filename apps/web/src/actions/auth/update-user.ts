'use server';

import { type UserRequest } from '@/types';
import { AuthApi } from '@/apis/auth.api';

export async function updateUser(data: Partial<UserRequest>) {
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
