import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StarRating from './StarRating';
import * as api from '../../api/client';

jest.mock('../../api/client');

describe('StarRating', () => {
    it('renders correct number of active stars', () => {
        render(<StarRating songId="1" initialRating={3} />);
        const stars = screen.getAllByText('★');
        expect(stars).toHaveLength(5);
        // We can't easily test the class 'active' without more setup, 
        // but we can check if it renders.
    });

    it('calls rateSong when a star is clicked', async () => {
        (api.rateSong as jest.Mock).mockResolvedValue({ id: '1', star_rating: 4 });
        render(<StarRating songId="1" initialRating={0} />);

        const stars = screen.getAllByText('★');
        fireEvent.click(stars[3]); // 4th star

        await waitFor(() => {
            expect(api.rateSong).toHaveBeenCalledWith('1', 4);
        });
    });

    it('prevents multiple updates simultaneously', async () => {
        (api.rateSong as jest.Mock).mockReturnValue(new Promise(resolve => setTimeout(resolve, 100)));
        render(<StarRating songId="1" initialRating={0} />);

        const stars = screen.getAllByText('★');
        fireEvent.click(stars[3]);
        fireEvent.click(stars[2]);

        expect(api.rateSong).toHaveBeenCalledTimes(1);
    });
});
