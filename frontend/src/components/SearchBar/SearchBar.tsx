import React, { useState } from 'react';
import { searchSong } from '../../api/client';
import { Song } from '../../types/song';
import styles from './SearchBar.module.scss';

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const songs = await searchSong(query);
            setResults(songs);
            if (songs.length === 0) {
                setError('No songs found matching your search.');
            }
        } catch (err: any) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleSearch} className={styles.inputWrapper}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Search songs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </form>

            {(results.length > 0 || error) && (
                <div className={styles.results}>
                    {error && <div className={styles.error}>{error}</div>}
                    {results.map((song) => (
                        <div key={song.id} className={styles.songResult}>
                            <strong>{song.title}</strong> — Energy: {song.energy?.toFixed(2)} | Danceability: {song.danceability?.toFixed(2)}
                        </div>
                    ))}
                    <button
                        className={styles.closeBtn}
                        onClick={() => { setResults([]); setError(null); }}
                        style={{ float: 'right', background: 'none', color: '#9ca3af', fontSize: '0.8rem' }}
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
