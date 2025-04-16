import { NextResponse } from 'next/server';
import { db } from '../../../../lib/prisma';
import { nanoid } from 'nanoid';

// API route to request a password reset
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log('Password reset requested for:', email);

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if the email exists or not for security
      return NextResponse.json({ success: true, message: 'If an account exists with this email, a reset link has been generated.' });
    }

    // Generate a unique token
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store the token in the database
    await db.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Return a URL with the token (in production, this would be emailed, but for now, return it directly)
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    return NextResponse.json({ success: true, message: 'If an account exists with this email, a reset link has been generated.', resetUrl });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
