import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const COOKIE_NAME = 'admin-token';

export function getCookieConfig(isProd: boolean = process.env.NODE_ENV === 'production'): Partial<ResponseCookie> {
  // Vercel部署的域名
  const domain = process.env.VERCEL_URL ? `.${new URL(`https://${process.env.VERCEL_URL}`).hostname}` : undefined;
  
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // Vercel需要'none'以支持跨域
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7天
    ...(domain && isProd && { domain }) // 生产环境设置域名
  };
}