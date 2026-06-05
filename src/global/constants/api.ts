export const API_URL =
  typeof window !== 'undefined'
    ? '/api' // Browser: use relative URL to ensure cookies are sent
    : (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000') + '/api' // Server-side: can use absolute URL
