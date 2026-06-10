import React from 'react';
import { render, screen } from '@testing-library/react';
import AcousticsTempoBars from './AcousticsTempoBars';

// Mock ResponsiveContainer as it doesn't work well in JSDOM
jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: any) => (
            <div style={{ width: '800px', height: '800px' }}>{children}</div>
        ),
    };
});

describe('AcousticsTempoBars', () => {
    it('renders the chart title', () => {
        const mockSongs = [
            { id: '1', title: 'Song 1', tempo: 120, acousticness: 0.5 },
        ];
        render(<AcousticsTempoBars data={mockSongs as any} />);
        expect(screen.getByText(/tempo & acousticness/i)).toBeInTheDocument();
    });
});
