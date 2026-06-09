import React, { useState } from 'react';
import { searchSong } from '../../api/client';
import { Song } from '../../types/song';
import styles from './SearchBar.module.scss';

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<Song | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const song = await searchSong(query);
            setResult(song);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('No song found with that exact title.');
            } else {
                setError('Something went wrong.');
            }
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
                    placeholder="Search by exact song title..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className={styles.btn} disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </form>

            {(result || error) && (
                <div className={styles.results}>
                    {error && <div className={styles.error}>{error}</div>}
                    {result && (
                        <div className={styles.songResult}>
                            <strong>{result.title}</strong> — Energy: {result.energy?.toFixed(2)} | Danceability: {result.danceability?.toFixed(2)}
                        </div>
                    )}
                    <button
                        className={styles.closeBtn}
                        onClick={() => { setResult(null); setError(null); }}
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
