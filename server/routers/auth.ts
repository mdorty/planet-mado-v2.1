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
