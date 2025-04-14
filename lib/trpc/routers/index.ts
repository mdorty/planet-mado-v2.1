import { router } from '../server';
import { characterRouter } from './character';
import { battleRouter } from './battle';
import { authRouter } from './auth';
import { adminRouter } from './admin';

export const appRouter = router({
  character: characterRouter,
  battle: battleRouter,
  auth: authRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;