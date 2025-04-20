import { procedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Ensure PrismaClient is initialized only once
const prisma = (global as any).prisma || new PrismaClient();

if (typeof window === 'undefined' && !(global as any).prisma) {
  (global as any).prisma = prisma;
}

/**
 * Auth Router
 * Handles user authentication operations like signup and login
 */
export const authRouter = router({
  /**
   * Change password for the currently authenticated user
   */
  changePassword: procedure
    .input(z.object({
      email: z.string().email(), // or use session context if available
      currentPassword: z.string().min(8),
      newPassword: z.string().min(8)
    }))
    .mutation(async ({ input }) => {
      const { email, currentPassword, newPassword } = input;
      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // Update user password
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });
      return { success: true };
    }),
  signUp: procedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
      username: z.string().min(3)
    }))
    .mutation(async ({ input }: { input: { email: string; password: string; username: string } }) => {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: input.email }
        });

        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: input.email,
            password: hashedPassword,
            username: input.username,
            role: 'user'
          }
        });

        // Return user data without password
        return {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role
        };
      } catch (error: unknown) {
        console.error('Error during signup:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
        throw new Error(errorMessage);
      }
    })
});
