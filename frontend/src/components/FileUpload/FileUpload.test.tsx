import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileUpload from './FileUpload';
import * as api from '../../api/client';

jest.mock('../../api/client');

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('FileUpload', () => {
    it('renders idle state initially', () => {
        render(<FileUpload />, { wrapper });
        expect(screen.getByText(/click or drag songs.json/i)).toBeInTheDocument();
    });

    it('handles file upload successfully', async () => {
        (api.ingestFile as jest.Mock).mockResolvedValue({ inserted: 42 });
        render(<FileUpload />, { wrapper });

        const file = new File(['{}'], 'songs.json', { type: 'application/json' });
        const input = screen.getByLabelText(/click or drag/i, { selector: 'input' });

        fireEvent.change(input, { target: { files: [file] } });

        expect(screen.getByText(/ingesting data/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/42 songs successfully loaded/i)).toBeInTheDocument();
        });
    });

    it('handles upload error', async () => {
        (api.ingestFile as jest.Mock).mockRejectedValue(new Error('Fail'));
        render(<FileUpload />, { wrapper });

        const file = new File(['{}'], 'songs.json', { type: 'application/json' });
        const input = screen.getByLabelText(/click or drag/i, { selector: 'input' });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
        });
    });
});
