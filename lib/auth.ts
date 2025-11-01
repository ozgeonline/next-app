import jwt, { JwtPayload } from 'jsonwebtoken';

export function verifyToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (err) {
    return null;
  }
}
