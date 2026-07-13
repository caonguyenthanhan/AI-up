import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSession } from '@/lib/auth';

// In-memory rate limiting map (IP -> { count, lockUntil })
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const attempt = loginAttempts.get(ip);

    // Check lock
    if (attempt && attempt.lockUntil > now) {
      const waitMinutes = Math.ceil((attempt.lockUntil - now) / 60000);
      return NextResponse.json(
        { error: `Thử quá nhiều lần. Vui lòng thử lại sau ${waitMinutes} phút.` },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    if (!verifyAdminPassword(password)) {
      const currentCount = attempt ? attempt.count + 1 : 1;
      
      if (currentCount >= 5) {
        // Lock for 5 minutes
        loginAttempts.set(ip, {
          count: currentCount,
          lockUntil: now + 5 * 60 * 1000,
        });
        return NextResponse.json(
          { error: 'Mật khẩu không chính xác. Bạn đã bị khóa đăng nhập trong 5 phút do thử sai quá 5 lần.' },
          { status: 429 }
        );
      } else {
        loginAttempts.set(ip, {
          count: currentCount,
          lockUntil: 0,
        });
        return NextResponse.json(
          { error: `Mật khẩu không chính xác. Còn lại ${5 - currentCount} lần thử.` },
          { status: 401 }
        );
      }
    }

    // Login successful - reset attempts
    loginAttempts.delete(ip);

    // Create session
    await createAdminSession();

    return NextResponse.json(
      { success: true, message: 'Đăng nhập thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ' },
      { status: 500 }
    );
  }
}
