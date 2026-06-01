export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'Unknown error occurred';

  const err = error as { message?: string; response?: { status?: number } };
  const message = err.message || String(error);

  if (message.includes('NetworkError') || message.includes('fetch')) {
    return 'Network error: Please check your internet connection';
  }
  if (message.includes('404')) {
    return 'No characters found. Try a different search term.';
  }
  if (message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  if (message.includes('429')) {
    return 'Too many requests. Please wait a moment.';
  }

  return `Failed to load data: ${message}`;
};
