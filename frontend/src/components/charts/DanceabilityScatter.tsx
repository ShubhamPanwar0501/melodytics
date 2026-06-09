import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Song } from '../../types/song';

interface Props {
    data: Song[];
}

const DanceabilityScatter: React.FC<Props> = ({ data }) => {
    const chartData = data.map(s => ({
        x: s.energy,
        y: s.danceability,
        name: s.title
    })).filter(d => d.x !== null && d.y !== null);

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Energy vs Danceability</h3>
            <ResponsiveContainer>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" dataKey="x" name="Energy" unit="" stroke="#9ca3af" />
                    <YAxis type="number" dataKey="y" name="Danceability" unit="" stroke="#9ca3af" />
                    <ZAxis type="category" dataKey="name" name="Song" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Songs" data={chartData} fill="#6366f1" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DanceabilityScatter;
