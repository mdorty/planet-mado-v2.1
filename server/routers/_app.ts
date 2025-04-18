import { router } from '../trpc';
import { mapRouter } from './map';
import { adminRouter } from './admin';
import { characterRouter } from './character';
import { authRouter } from './auth';
import { itemRouter } from './item';
// Import other routers here as needed

export const appRouter = router({
  map: mapRouter,
  admin: adminRouter,
  character: characterRouter,
  auth: authRouter,
  item: itemRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
