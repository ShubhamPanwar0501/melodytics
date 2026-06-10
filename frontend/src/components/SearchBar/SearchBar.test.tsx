import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';
import * as api from '../../api/client';

jest.mock('../../api/client');

describe('SearchBar', () => {
    it('updates query state on input change', () => {
        render(<SearchBar />);
        const input = screen.getByPlaceholderText(/search songs.../i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'In the End' } });
        expect(input.value).toBe('In the End');
    });

    it('performs search and displays results', async () => {
        const mockSongs = [
            { id: '1', title: 'Song One', energy: 0.8, danceability: 0.7, tempo: 120, duration_ms: 200000 },
        ];
        (api.searchSong as jest.Mock).mockResolvedValue(mockSongs);

        render(<SearchBar />);
        const input = screen.getByPlaceholderText(/search songs.../i);
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: 'Song' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/song one/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/energy: 0.80/i)).toBeInTheDocument();
    });

    it('displays error message when no results found', async () => {
        (api.searchSong as jest.Mock).mockResolvedValue([]);

        render(<SearchBar />);
        const input = screen.getByPlaceholderText(/search songs.../i);
        const button = screen.getByRole('button', { name: /search/i });

        fireEvent.change(input, { target: { value: 'None' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/no songs found/i)).toBeInTheDocument();
        });
    });

    it('clears results when Clear button is clicked', async () => {
        const mockSongs = [{ id: '1', title: 'Song One', energy: 0.8, danceability: 0.7 }];
        (api.searchSong as jest.Mock).mockResolvedValue(mockSongs);

        render(<SearchBar />);
        fireEvent.change(screen.getByPlaceholderText(/search songs.../i), { target: { value: 'Song' } });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => expect(screen.getByText(/song one/i)).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /clear/i }));
        expect(screen.queryByText(/song one/i)).not.toBeInTheDocument();
    });
});
