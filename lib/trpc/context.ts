import { db } from '../prisma';
import { auth } from '../auth';

export type Context = {
  db: typeof db;
  session: Awaited<ReturnType<typeof auth>>;
};

export async function createContext() {
  const session = await auth();
  return { db, session };
}