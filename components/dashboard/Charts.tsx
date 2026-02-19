"use client"

import {
    BarChart,
    Bar,
    Tooltip,
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
} from 'recharts';

export function TimeChart({ data }: { data: any[] }) {
    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <Bar
                        dataKey="value"
                        fill="currentColor"
                        className="text-blue-600/20 hover:text-blue-600 transition-colors"
                        radius={[4, 4, 0, 0]}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-black text-white text-[10px] px-2 py-1 rounded shadow-xl">
                                        {payload[0].value}m
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function SkillRadar({ data }: { data: any[] }) {
    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid className="stroke-zinc-100 dark:stroke-zinc-800" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Radar
                        name="Skills"
                        dataKey="value"
                        stroke="#2563eb"
                        fill="#2563eb"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
