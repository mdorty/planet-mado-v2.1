import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '../../../lib/prisma';

// Temporary API route to reset password for testing purposes
export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();
    console.log('Resetting password for:', email);
    console.log('New password length:', newPassword.length);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('New hashed password length:', hashedPassword.length);

    // Update the user's password in the database
    const user = await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    if (user) {
      return NextResponse.json({ success: true, message: 'Password reset successful' });
    } else {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
