import React from 'react';
import { render, screen } from '@testing-library/react';
import DurationHistogram from './DurationHistogram';

jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: any) => (
            <div style={{ width: '800px', height: '800px' }}>{children}</div>
        ),
    };
});

describe('DurationHistogram', () => {
    it('renders the chart title', () => {
        const mockSongs = [
            { id: '1', title: 'Song 1', duration_ms: 180000 },
        ];
        render(<DurationHistogram data={mockSongs as any} />);
        expect(screen.getByText(/duration distribution/i)).toBeInTheDocument();
    });
});
