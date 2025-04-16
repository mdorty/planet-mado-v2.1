import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '../../../lib/prisma';

// Temporary API route to test password validation
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log('Testing password for:', email);
    console.log('Input password length:', password.length);

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found or no password set' }, { status: 404 });
    }

    console.log('Stored password hash length:', user.password.length);
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return NextResponse.json({ success: true, message: 'Password is valid' });
    } else {
      return NextResponse.json({ success: false, message: 'Password is invalid' });
    }
  } catch (error) {
    console.error('Error testing password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
