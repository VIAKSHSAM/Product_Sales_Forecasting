import { useEffect, useState } from 'react'
import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
BarChart,
Bar,
ResponsiveContainer
} from 'recharts'

function Analytics() {
const [data, setData] = useState(null)
const [error, setError] = useState('')


useEffect(() => {
    fetch('http://127.0.0.1:8000/analytics', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch analytics')
            }
            return res.json()
        })
        .then(result => setData(result))
        .catch(err => setError(err.message))
}, [])

if (error) {
    return <div className="bg-red-50 text-red-600 p-5 rounded-xl">{error}</div>
}

if (!data) {
    return <div className="text-slate-500 p-5">Loading Analytics...</div>
}

const cards = [
    {
        title: 'Total Products',
        value: data.total_products,
        icon: '📦',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        title: 'Total Units Sold',
        value: data.total_sales.toLocaleString('en-IN'),
        icon: '🛒',
        color: 'bg-green-100 text-green-600'
    },
    {
        title: 'Total Revenue',
        value: `₹${data.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
        icon: '💰',
        color: 'bg-purple-100 text-purple-600'
    }
]

const formatMonth = (month) => {
    const date = new Date(`${month}-01`)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit'
    })
}

const formatNumber = (value) => value.toLocaleString('en-IN')

const chartCard = 'bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition'

return (
    <div className="space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">
                    Analytics Overview
                </h2>
                <p className="text-slate-500 mt-2">
                    Monitor your retail sales performance and business insights.
                </p>
            </div>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold w-fit">
                ● Live Dataset
            </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {cards.map((card) => (
                <div key={card.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition duration-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500 font-medium">
                                {card.title}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-3">
                                {card.value}
                            </h3>
                        </div>

                        <div className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            <div className={chartCard}>
                <h3 className="text-lg font-bold text-slate-800">
                    Monthly Sales Trend
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                    Sales performance over time
                </p>

                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={data.monthly_sales} margin={{ top: 10, right: 15, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                        <YAxis tickFormatter={formatNumber} tick={{ fontSize: 11 }} />
                        <Tooltip labelFormatter={formatMonth} formatter={(value) => [formatNumber(value), 'Sales']} />
                        <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={chartCard}>
                <h3 className="text-lg font-bold text-slate-800">
                    Category-wise Sales
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                    Compare sales across product categories
                </p>

                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data.category_sales} margin={{ top: 10, right: 15, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={formatNumber} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => [formatNumber(value), 'Sales']} />
                        <Bar dataKey="sales" fill="#16a34a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={chartCard}>
                <h3 className="text-lg font-bold text-slate-800">
                    Region-wise Sales
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                    Compare sales across different regions
                </p>

                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data.region_sales} margin={{ top: 10, right: 15, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="region" />
                        <YAxis tickFormatter={formatNumber} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => [formatNumber(value), 'Sales']} />
                        <Bar dataKey="sales" fill="#9333ea" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={chartCard}>
                <h3 className="text-lg font-bold text-slate-800">
                    Top 10 Products
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                    Best-performing products by units sold
                </p>

                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data.top_products} margin={{ top: 10, right: 15, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="product" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={formatNumber} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => [formatNumber(value), 'Units Sold']} />
                        <Bar dataKey="sales" fill="#ea580c" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    </div>
)


}

export default Analytics
