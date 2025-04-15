export function getUrl() {
    if (typeof window !== 'undefined') {
      return window.location.origin + '/api/trpc';
    }
    // For server-side, use NEXTAUTH_URL if available (important for production), otherwise fallback to a default
    return process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL + '/api/trpc' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/trpc');
  }