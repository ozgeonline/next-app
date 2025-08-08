import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connect from '@/lib/db';
import User from '@/app/models/User';

interface DecodedToken {
  id: string;
  [key: string]: any;
}

export async function GET() {
  const cookieStore = await cookies();
  
  const token = cookieStore.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = verifyToken(token) as DecodedToken;
  if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  await connect();
  const user = await User.findById(decoded.id).select('-password');
  return NextResponse.json(user);
}
