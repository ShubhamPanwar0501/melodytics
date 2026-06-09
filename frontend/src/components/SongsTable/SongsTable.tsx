import React from 'react';
import { PaginatedSongs } from '../../types/song';
import StarRating from '../StarRating/StarRating';
import styles from './SongsTable.module.scss';

interface Props {
    data: PaginatedSongs;
    sortBy: string;
    order: 'asc' | 'desc';
    onPageChange: (page: number) => void;
    onSortChange: (field: string) => void;
}

const SongsTable: React.FC<Props> = ({
    data,
    sortBy,
    order,
    onPageChange,
    onSortChange
}) => {
    const headers = [
        { label: 'Title', key: 'title' },
        { label: 'Energy', key: 'energy' },
        { label: 'Danceability', key: 'danceability' },
        { label: 'Tempo', key: 'tempo' },
        { label: 'Duration', key: 'duration_ms' },
        { label: 'Rating', key: 'star_rating' },
    ];

    const formatDuration = (ms: number | null) => {
        if (!ms) return '-';
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            {headers.map(h => (
                                <th
                                    key={h.key}
                                    className={styles.sortable}
                                    onClick={() => onSortChange(h.key)}
                                >
                                    {h.label} {sortBy === h.key && (order === 'asc' ? '↑' : '↓')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map(song => (
                            <tr key={song.id}>
                                <td>{song.title}</td>
                                <td>{song.energy?.toFixed(2) || '-'}</td>
                                <td>{song.danceability?.toFixed(2) || '-'}</td>
                                <td>{Math.round(song.tempo || 0)} BPM</td>
                                <td>{formatDuration(song.duration_ms)}</td>
                                <td>
                                    <StarRating songId={song.id} initialRating={song.star_rating} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <span className={styles.pageInfo}>
                    Page {data.page} of {data.pages} ({data.total} total)
                </span>
                <div className={styles.controls}>
                    <button
                        className={styles.btn}
                        disabled={data.page === 1}
                        onClick={() => onPageChange(data.page - 1)}
                    >
                        Prev
                    </button>
                    <button
                        className={styles.btn}
                        disabled={data.page === data.pages}
                        onClick={() => onPageChange(data.page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SongsTable;
