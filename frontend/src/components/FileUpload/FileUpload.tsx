import React, { useState, ChangeEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ingestFile } from '../../api/client';
import styles from './FileUpload.module.scss';

type Status = 'idle' | 'uploading' | 'done' | 'error';

const FileUpload: React.FC = () => {
    const [status, setStatus] = useState<Status>('idle');
    const [count, setCount] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('uploading');
        try {
            const result = await ingestFile(file);
            setCount(result.inserted);
            setStatus('done');
            queryClient.invalidateQueries({ queryKey: ['songs'] });
        } catch (err) {
            console.error('Upload failed:', err);
            setStatus('error');
        }
    };

    return (
        <div className={styles.wrapper}>
            <label className={styles.dropzone}>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    hidden
                    disabled={status === 'uploading'}
                />
                {status === 'idle' && (
                    <>
                        <div className={styles.icon}>📁</div>
                        <span>Click or drag songs.json to ingest</span>
                    </>
                )}
                {status === 'uploading' && <span className={styles.status + ' ' + styles.uploading}>Ingesting data...</span>}
                {status === 'done' && (
                    <span className={styles.status + ' ' + styles.done}>
                        ✓ {count} songs successfully loaded
                    </span>
                )}
                {status === 'error' && (
                    <span className={styles.status + ' ' + styles.error}>
                        ⚠ Upload failed. Check file format.
                    </span>
                )}
            </label>
        </div>
    );
};

export default FileUpload;
