import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PriceChart({ data }) {
    // If no data, show mock trend for visualization
    const chartData = data && data.length > 0 ? data : [
        { day: 'Day 1', price: 1800, minPrice: 1200 },
        { day: 'Day 2', price: 1850, minPrice: 1250 },
        { day: 'Day 3', price: 1820, minPrice: 1280 },
        { day: 'Day 4', price: 1900, minPrice: 1300 },
        { day: 'Day 5', price: 1950, minPrice: 1320 },
        { day: 'Day 6', price: 2000, minPrice: 1280 },
        { day: 'Day 7', price: 1980, minPrice: 1250 },
    ];

    return (
        <div className="h-64 w-full bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Price Trends (Next 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} name="Modal Price" />
                    <Line type="monotone" dataKey="minPrice" stroke="#FF9800" strokeWidth={2} dot={false} name="Min Price" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
