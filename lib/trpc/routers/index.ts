import { router } from '../server';
import { characterRouter } from './character';
import { battleRouter } from './battle';
import { authRouter } from './auth';
import { adminRouter } from './admin';
import { itemRouter } from './item';

export const appRouter = router({
  character: characterRouter,
  battle: battleRouter,
  auth: authRouter,
  admin: adminRouter,
  item: itemRouter,
});

export type AppRouter = typeof appRouter;