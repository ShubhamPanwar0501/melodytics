import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Song } from '../../types/song';

interface Props {
    data: Song[];
}

const DurationHistogram: React.FC<Props> = ({ data }) => {
    // Bin by minutes
    const bins: Record<string, number> = {};
    data.forEach(s => {
        if (!s.duration_ms) return;
        const mins = Math.floor(s.duration_ms / 60000);
        const binLabel = `${mins}-${mins + 1}m`;
        bins[binLabel] = (bins[binLabel] || 0) + 1;
    });

    const chartData = Object.entries(bins)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => parseInt(a.name) - parseInt(b.name));

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Duration Distribution</h3>
            <ResponsiveContainer>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    <Bar dataKey="count" fill="#10b981" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DurationHistogram;
