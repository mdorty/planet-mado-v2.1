export function getUrl() {
    if (typeof window !== 'undefined') {
      return window.location.origin + '/api/trpc';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/trpc';
  }