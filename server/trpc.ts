import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

// Initialize tRPC with superjson transformer
const t = initTRPC.create({
  transformer: superjson
});

export const router = t.router;
export const procedure = t.procedure;
