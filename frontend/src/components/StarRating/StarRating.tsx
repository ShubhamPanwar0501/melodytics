import React, { useState } from 'react';
import { rateSong } from '../../api/client';
import styles from './StarRating.module.scss';

interface Props {
    songId: string;
    initialRating: number | null;
}

const StarRating: React.FC<Props> = ({ songId, initialRating }) => {
    const [rating, setRating] = useState(initialRating || 0);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleRate = async (stars: number) => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            await rateSong(songId, stars);
            setRating(stars);
        } catch (err) {
            console.error('Failed to rate song:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={`${styles.stars} ${isUpdating ? styles.loading : ''}`}>
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    className={`${styles.star} ${star <= rating ? styles.active : ''}`}
                    onClick={() => handleRate(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;
