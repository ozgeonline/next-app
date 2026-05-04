export const rateLimitMap = new Map<string, { count: number; startTime: number }>();

export function rateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 60000
): {
  success: boolean;
  resetTime: number;
} {
  const current = rateLimitMap.get(ip) || { count: 0, startTime: Date.now() };

  if (Date.now() - current.startTime > windowMs) {
    current.count = 1;
    current.startTime = Date.now();
  } else {
    current.count++;
  }

  rateLimitMap.set(ip, current);

  const resetTime = current.startTime + windowMs;

  return {
    success: current.count <= limit,
    resetTime,
  };
}
