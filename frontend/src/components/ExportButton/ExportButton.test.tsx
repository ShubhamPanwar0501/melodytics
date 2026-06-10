import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportButton from './ExportButton';

describe('ExportButton', () => {
    it('does nothing if no songs provided', () => {
        const createObjectURL = jest.fn();
        global.URL.createObjectURL = createObjectURL;

        render(<ExportButton songs={[]} />);
        fireEvent.click(screen.getByText(/export csv/i));

        expect(createObjectURL).not.toHaveBeenCalled();
    });

    it('triggers a CSV download when songs are provided', () => {
        const songs = [{ id: '1', title: 'Song 1', energy: 0.8, danceability: 0.7 }];

        // Use a real anchor click via a spy rather than mocking createElement
        const createObjectURL = jest.fn().mockReturnValue('blob:url');
        const revokeObjectURL = jest.fn();
        global.URL.createObjectURL = createObjectURL;
        global.URL.revokeObjectURL = revokeObjectURL;

        // Spy on the anchor's click without intercepting createElement
        const originalCreateElement = document.createElement.bind(document);
        const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            const el = originalCreateElement(tagName);
            if (tagName === 'a') {
                jest.spyOn(el as HTMLAnchorElement, 'click').mockImplementation(() => { });
            }
            return el;
        });

        render(<ExportButton songs={songs as any} />);
        fireEvent.click(screen.getByText(/export csv/i));

        expect(createObjectURL).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:url');

        createElementSpy.mockRestore();
    });
});
