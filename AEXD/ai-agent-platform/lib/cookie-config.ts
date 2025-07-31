import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const COOKIE_NAME = 'admin-token';

export function getCookieConfig(isProd: boolean = process.env.NODE_ENV === 'production'): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax', // 使用strict提高安全性
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7天
  };
}