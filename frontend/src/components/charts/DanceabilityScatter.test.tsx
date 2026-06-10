import React from 'react';
import { render, screen } from '@testing-library/react';
import DanceabilityScatter from './DanceabilityScatter';

jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: any) => (
            <div style={{ width: '800px', height: '800px' }}>{children}</div>
        ),
    };
});

describe('DanceabilityScatter', () => {
    it('renders the chart title', () => {
        const mockSongs = [
            { id: '1', title: 'Song 1', danceability: 0.7, energy: 0.8 },
        ];
        render(<DanceabilityScatter data={mockSongs as any} />);
        expect(screen.getByText(/energy vs danceability/i)).toBeInTheDocument();
    });
});
