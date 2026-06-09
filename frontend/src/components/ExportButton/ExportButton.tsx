import React from 'react';
import { Song } from '../../types/song';

interface Props {
    songs: Song[];
}

const ExportButton: React.FC<Props> = ({ songs }) => {
    const handleExport = () => {
        if (!songs.length) return;

        const headers = Object.keys(songs[0]).join(',');
        const rows = songs.map(song =>
            Object.values(song)
                .map(val => (val === null ? '' : `"${val}"`))
                .join(',')
        );

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `melodytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleExport}
            style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                fontWeight: 600,
                marginBottom: '16px'
            }}
        >
            Export CSV
        </button>
    );
};

export default ExportButton;
