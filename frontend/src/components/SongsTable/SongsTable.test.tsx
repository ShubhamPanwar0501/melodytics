import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SongsTable from './SongsTable';

const mockData = {
    items: [
        { id: '1', title: 'Song 1', energy: 0.5, danceability: 0.6, tempo: 100, duration_ms: 180000, star_rating: 4 },
        { id: '2', title: 'Song 2', energy: 0.8, danceability: 0.4, tempo: 140, duration_ms: 240000, star_rating: null },
    ],
    total: 2,
    page: 1,
    page_size: 10,
    pages: 1,
};

describe('SongsTable', () => {
    const onPageChange = jest.fn();
    const onSortChange = jest.fn();

    it('renders table headers and data correctly', () => {
        render(
            <SongsTable
                data={mockData as any}
                sortBy="title"
                order="asc"
                onPageChange={onPageChange}
                onSortChange={onSortChange}
            />
        );

        expect(screen.getByText('Song 1')).toBeInTheDocument();
        expect(screen.getByText('Song 2')).toBeInTheDocument();
        expect(screen.getByText('100 BPM')).toBeInTheDocument();
        expect(screen.getByText('3:00')).toBeInTheDocument(); // 180000ms
        expect(screen.getByText('4:00')).toBeInTheDocument(); // 240000ms
    });

    it('calls onSortChange when header is clicked', () => {
        render(
            <SongsTable
                data={mockData as any}
                sortBy="title"
                order="asc"
                onPageChange={onPageChange}
                onSortChange={onSortChange}
            />
        );

        fireEvent.click(screen.getByText(/energy/i));
        expect(onSortChange).toHaveBeenCalledWith('energy');
    });

    it('disables pagination buttons correctly', () => {
        render(
            <SongsTable
                data={mockData as any}
                sortBy="title"
                order="asc"
                onPageChange={onPageChange}
                onSortChange={onSortChange}
            />
        );

        expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('calls onPageChange when buttons are enabled and clicked', () => {
        const paginatedData = { ...mockData, pages: 2, page: 1 };
        render(
            <SongsTable
                data={paginatedData as any}
                sortBy="title"
                order="asc"
                onPageChange={onPageChange}
                onSortChange={onSortChange}
            />
        );

        const nextBtn = screen.getByRole('button', { name: /next/i });
        expect(nextBtn).not.toBeDisabled();
        fireEvent.click(nextBtn);
        expect(onPageChange).toHaveBeenCalledWith(2);
    });
});
