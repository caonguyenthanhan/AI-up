import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth';

export async function POST() {
  try {
    await clearAdminSession();
    return NextResponse.json(
      { success: true, message: 'Đã đăng xuất' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Logout error:', error);
    return NextResponse.json(
      { error: 'Lỗi đăng xuất' },
      { status: 500 }
    );
  }
}
