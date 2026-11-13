
import { useState, useEffect } from 'react'
import Analytics from './components/Analytics'
import Auth from './components/Auth'
import SalesPrediction from './components/SalesPrediction'
import PredictionHistory from './components/PredictionHistory'
import AboutProject from './components/AboutProject'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer
} from 'recharts'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [recentPredictions, setRecentPredictions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('access_token')
  )

  const handleLogin = (username) => {
    setIsLoggedIn(true)
    localStorage.setItem('username', username)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('username')
    setIsLoggedIn(false)
    setActivePage('Dashboard')
  }

  const menuItems = [
    { name: 'Dashboard'  },
    { name: 'Sales Prediction',  },
    { name: 'Prediction History', },
    { name: 'Analytics', },
    { name: 'About Project' }
  ]

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/analytics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`API Error: ${res.status}`)
          }
          return res.json()
        })
        .then(data => setDashboardData(data))
        .catch(err => console.log(err))
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn && activePage === 'Dashboard') {
      fetch('/api/prediction-history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch predictions')
          }
          return res.json()
        })
        .then(data => setRecentPredictions(data.slice(0, 5)))
        .catch(err => console.log(err))
    }
  }, [isLoggedIn, activePage])

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />
  }

  const handlePageChange = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  const formatNumber = (num) => Number(num ?? 0).toLocaleString('en-IN')

  const formatMonth = (month) => {
    const date = new Date(`${month}-01`)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit'
    })
  }

  const cards = [
    {
      title: 'Total Products',
      value: dashboardData ? dashboardData.total_products : 'Loading...',
      
    },
    {
      title: 'Total Sales',
      value: dashboardData ? formatNumber(dashboardData.total_sales) : 'Loading...',
     
    },
    {
      title: 'Total Revenue',
      value: dashboardData ? `₹${dashboardData.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : 'Loading...',
      
    },
    {
      title: 'Model R² Score',
      value: '34.04%',
     
     
    },
    {
      title: 'MAE',
      value: '68.80',
      
      
    },
    {
      title: 'RMSE',
      value: '87.91',
     
    }
  ]

  const chartCard = 'bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition'

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed md:sticky top-0 left-0 z-50 w-64 shrink-0 bg-slate-900 text-white p-6 h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            <span className="text-green-400">Sales</span>Predict
          </h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl text-slate-300 md:hidden"
          >
            ×
          </button>
        </div>

        <p className="text-slate-400 text-xs mb-10">
          Product & Sales Forecasting
        </p>

        <p className="text-slate-500 uppercase text-xs font-semibold mb-4">
          Main Menu
        </p>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handlePageChange(item.name)}
              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition duration-200 ${activePage === item.name
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 p-4 bg-slate-800 rounded-xl">
  <p className="text-green-400 text-sm font-bold tracking-wide">
    RETAIL INTELLIGENCE
  </p>
  <p className="text-slate-300 text-xs mt-2 leading-relaxed">
    Machine Learning-Based Sales Forecasting & Business Analytics
  </p>
  <p className="text-blue-400 text-xs font-semibold mt-3">
    Predict. Analyze. Grow.
  </p>
</div>

        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-slate-400 text-sm mb-3">
            Welcome, {localStorage.getItem('username')}
          </p>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Logout
          </button>
        </div>

      </aside>

      <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto p-4 md:p-8">

        <div className="flex items-center gap-3 mb-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xl"
          >
            ☰
          </button>

          <h1 className="text-xl font-bold text-slate-800">
            <span className="text-green-600">Sales</span>Predict
          </h1>
        </div>

        {activePage === 'Dashboard' && (

          <div className="space-y-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  Dashboard Overview
                </h2>

                <p className="text-slate-500 mt-2">
                  Welcome to Product & Sales Forecasting System.
                </p>
              </div>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold w-fit">
                ● System Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">

              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-500 font-medium">
                        {card.title}
                      </p>

                      <h3 className="text-xl md:text-3xl font-bold text-slate-800 mt-3 break-words">
                        {card.value}
                      </h3>
                    </div>

                    <div className={`${card.color} w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl shrink-0`}>
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
                  <LineChart data={dashboardData ? dashboardData.monthly_sales : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                    <YAxis
                      tickFormatter={formatNumber}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />                    <Tooltip
                      labelFormatter={formatMonth}
                      formatter={(value) => [
                        `${formatNumber(value)} Units`,
                        'Total Sales'
                      ]}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      labelStyle={{
                        color: '#1e293b',
                        fontWeight: '600',
                        marginBottom: '5px'
                      }}
                      itemStyle={{
                        color: '#2563eb',
                        fontWeight: '600'
                      }}
                      cursor={{
                        stroke: '#94a3b8',
                        strokeDasharray: '4 4'
                      }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={chartCard}>
                <h3 className="text-lg font-bold text-slate-800">
                  Sales by Category
                </h3>

                <p className="text-sm text-slate-500 mt-1 mb-6">
                  Compare sales across product categories
                </p>

                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={dashboardData ? dashboardData.category_sales : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <YAxis
                      tickFormatter={formatNumber}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />                    <Tooltip
                      formatter={(value) => [
                        `${formatNumber(value)} Units`,
                        'Total Sales'
                      ]}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      labelStyle={{
                        color: '#1e293b',
                        fontWeight: '600'
                      }}
                      itemStyle={{
                        color: '#16a34a',
                        fontWeight: '600'
                      }}
                    />                   <Legend formatter={() => 'Total Sales'} />
                    <Bar dataKey="sales" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={chartCard}>
                <h3 className="text-lg font-bold text-slate-800">
                  Sales by Region
                </h3>

                <p className="text-sm text-slate-500 mt-1 mb-6">
                  Compare sales across different regions
                </p>

                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={dashboardData ? dashboardData.region_sales : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="region" />
                    <YAxis
                      tickFormatter={formatNumber}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />                    <Tooltip
                      formatter={(value) => [
                        `${formatNumber(value)} Units`,
                        'Total Sales'
                      ]}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      labelStyle={{
                        color: '#1e293b',
                        fontWeight: '600'
                      }}
                      itemStyle={{
                        color: '#9333ea',
                        fontWeight: '600'
                      }}
                    />                    <Bar dataKey="sales" fill="#9333ea" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={chartCard}>
                <h3 className="text-lg font-bold text-slate-800">
                  Top 5 Products by Sales
                </h3>

                <p className="text-sm text-slate-500 mt-1 mb-6">
                  Best-performing products
                </p>

                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={dashboardData ? dashboardData.top_products.slice(0, 5) : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="product" />
                    <YAxis
                      tickFormatter={formatNumber}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />                    <Tooltip
                      formatter={(value) => [
                        `${formatNumber(value)} Units`,
                        'Total Sales'
                      ]}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                      }}
                      labelStyle={{
                        color: '#1e293b',
                        fontWeight: '600'
                      }}
                      itemStyle={{
                        color: '#ea580c',
                        fontWeight: '600'
                      }}
                    />                    <Bar dataKey="sales" fill="#ea580c" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>


            </div>
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">

              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Recent Predictions
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Your latest sales predictions
                  </p>
                </div>

                <button
                  onClick={() => handlePageChange('Prediction History')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  View All →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-slate-500 text-sm">
                      <th className="py-3 px-3">Product</th>
                      <th className="py-3 px-3">Predicted Sales</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentPredictions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-slate-500">
                          No predictions available.
                        </td>
                      </tr>
                    ) : (
                      recentPredictions.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-slate-50">
                          <td className="py-4 px-3 font-semibold text-slate-700">
                            {item.product}
                          </td>

                          <td className="py-4 px-3 text-slate-700">
                            {Number(item.sales).toFixed(2)} Units
                          </td>

                          <td className="py-4 px-3 text-slate-500">
                            {new Date(item.date).toLocaleDateString('en-IN')}
                          </td>

                          <td className="py-4 px-3">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {activePage === 'Sales Prediction' && <SalesPrediction />}
        {activePage === 'Prediction History' && <PredictionHistory />}
        {activePage === 'About Project' && <AboutProject />}
        {activePage === 'Analytics' && <Analytics />}



      </main>
    </div>
  )
}

export default App

