import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '@/server/routers/_app';
import superjson from 'superjson';
import { db } from '../prisma';

// Type for the session context expected by the router
type SessionContext = {
  user?: { id: string } | null;
};

export async function getServerSideHelpers(userId?: string) {
  return createServerSideHelpers({
    router: appRouter,
    ctx: { 
      db,
      session: userId ? { user: { id: userId } } as SessionContext : null 
    },
    transformer: superjson,
  });
}
