import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../../server/routers/_app';

export const dynamic = 'force-dynamic';

console.log('API route initialized');

export async function GET(
  req: Request,
  { params }: { params: { trpc: string } }
) {
  console.log('GET request received for:', params.trpc);
  try {
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      router: appRouter,
      req,
      createContext: () => ({}),
    });
    console.log('GET response:', response.status);
    return response;
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { trpc: string } }
) {
  console.log('POST request received for:', params.trpc);
  try {
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      router: appRouter,
      req,
      createContext: () => ({}),
    });
    console.log('POST response:', response.status);
    return response;
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
