import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '../../../../lib/prisma';

// API route to confirm password reset with a token
export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    console.log('Confirming password reset with token:', token);

    const resetToken = await db.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json({ success: false, message: 'Token has expired' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await db.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await db.passwordResetToken.delete({ where: { id: resetToken.id } });

    return NextResponse.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Error confirming password reset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
