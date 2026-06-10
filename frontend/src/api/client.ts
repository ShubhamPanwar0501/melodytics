import axios from 'axios';
import { PaginatedSongs, Song, IngestResult } from '../types/song';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

export const getSongs = async (
    page = 1,
    pageSize = 10,
    sortBy = 'title',
    order: 'asc' | 'desc' = 'asc'
): Promise<PaginatedSongs> => {
    const response = await api.get<PaginatedSongs>('/songs', {
        params: { page, page_size: pageSize, sort_by: sortBy, order },
    });
    return response.data;
};

export const searchSong = async (title: string): Promise<Song[]> => {
    const response = await api.get<Song[]>('/songs/search', {
        params: { title },
    });
    return response.data;
};

export const rateSong = async (songId: string, stars: number): Promise<Song> => {
    const response = await api.patch<Song>(`/songs/${songId}/rating`, {
        stars,
    });
    return response.data;
};

export const ingestFile = async (file: File): Promise<IngestResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<IngestResult>('/ingest', formData);
    return response.data;
};
