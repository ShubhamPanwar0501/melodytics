import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Song } from '../../types/song';

interface Props {
    data: Song[];
}

const AcousticsTempoBars: React.FC<Props> = ({ data }) => {
    const chartData = data.slice(0, 10).map(s => ({
        name: s.title.length > 15 ? s.title.substring(0, 12) + '...' : s.title,
        tempo: s.tempo,
        acousticness: (s.acousticness || 0) * 100, // Scale to match tempo range better
    }));

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Tempo & Acousticness (Top 10)</h3>
            <ResponsiveContainer>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} interval={0} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    <Legend />
                    <Bar dataKey="tempo" fill="#6366f1" name="Tempo (BPM)" />
                    <Bar dataKey="acousticness" fill="#fca311" name="Acousticness (%)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AcousticsTempoBars;
