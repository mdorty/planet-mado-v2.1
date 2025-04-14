import { router } from '../trpc';
import { mapRouter } from './map';
import { adminRouter } from './admin';
import { characterRouter } from './character';
// Import other routers here as needed

export const appRouter = router({
  map: mapRouter,
  admin: adminRouter,
  character: characterRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;
