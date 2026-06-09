import { useQuery } from '@tanstack/react-query';
import { getSongs } from '../api/client';

export const useSongs = (
    page: number,
    pageSize: number,
    sortBy: string,
    order: 'asc' | 'desc'
) => {
    return useQuery({
        queryKey: ['songs', page, pageSize, sortBy, order],
        queryFn: () => getSongs(page, pageSize, sortBy, order),
    });
};
