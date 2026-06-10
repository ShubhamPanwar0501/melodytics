import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import * as useSongsHook from './hooks/useSongs';

jest.mock('./hooks/useSongs');

// Recharts ResponsiveContainer requires real DOM dimensions which JSDOM lacks.
// Mock it to render children directly to avoid warnings/errors.
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: '800px', height: '800px' }}>{children}</div>
    ),
  };
});

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('App', () => {
  it('renders loading state', () => {
    (useSongsHook.useSongs as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
      error: null,
    });

    renderApp();
    expect(screen.getByText(/analyzing your playlist/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useSongsHook.useSongs as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: new Error('Failed'),
    });

    renderApp();
    expect(screen.getByText(/failed to load music data/i)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    (useSongsHook.useSongs as jest.Mock).mockReturnValue({
      data: { items: [], total: 0, pages: 1, page: 1 },
      isLoading: false,
      isFetching: false,
      error: null,
    });

    renderApp();
    expect(screen.getByText(/no songs found/i)).toBeInTheDocument();
  });

  it('renders data state with songs', () => {
    (useSongsHook.useSongs as jest.Mock).mockReturnValue({
      data: {
        items: [{ id: '1', title: 'Test Song', energy: 0.5, danceability: 0.6, tempo: 100, duration_ms: 180000 }],
        total: 1,
        pages: 1,
        page: 1
      },
      isLoading: false,
      isFetching: false,
      error: null,
    });

    renderApp();
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText(/export csv/i)).toBeInTheDocument();
  });
});
