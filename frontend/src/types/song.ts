export interface Song {
    id: string;
    title: string;
    mode: number | null;
    acousticness: number | null;
    danceability: number | null;
    energy: number | null;
    instrumentalness: number | null;
    liveness: number | null;
    loudness: number | null;
    speechiness: number | null;
    tempo: number | null;
    valence: number | null;
    duration_ms: number | null;
    num_sections: number | null;
    num_segments: number | null;
    star_rating: number | null;
    created_at: string;
}

export interface PaginatedSongs {
    items: Song[];
    total: number;
    page: number;
    page_size: number;
    pages: number;
}

export interface IngestResult {
    inserted: number;
    message: string;
}
