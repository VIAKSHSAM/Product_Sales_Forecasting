
import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function PredictionHistory() {
    const [history, setHistory] = useState([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [error, setError] = useState('')

    const loadHistory = async () => {
        setHistoryLoading(true)

        try {
            const response = await fetch(
                '/api/prediction-history',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch prediction history')
            }

            const data = await response.json()
            setHistory(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setHistoryLoading(false)
        }
    }

    useEffect(() => {
        loadHistory()
    }, [])

    const importCSV = (e) => {
        const file = e.target.files[0]

        if (!file) return

        const reader = new FileReader()

        reader.onload = async (event) => {
            const text = event.target.result
            const rows = text.split('\n').slice(1)

            try {
                for (const row of rows) {
                    if (!row.trim()) continue

                    const [product, sales, date] = row.split(',')

                    const response = await fetch(
                        '/api/import-history',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('access_token')}`
                            },
                            body: JSON.stringify({
                                product: product.trim(),
                                sales: Number(sales),
                                date: date.trim()
                            })
                        }
                    )

                    if (!response.ok) {
                        throw new Error('CSV import failed')
                    }
                }

                await loadHistory()
                alert('CSV imported successfully!')
            } catch (err) {
                setError(err.message)
            }
        }

        reader.readAsText(file)
        e.target.value = ''
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `/api/prediction-history/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Failed to delete prediction')
            }

            await loadHistory()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleClearHistory = async () => {
        if (!window.confirm('Are you sure you want to delete all prediction history?')) {
            return
        }

        try {
            const response = await fetch(
                '/api/prediction-history',
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Failed to clear prediction history')
            }

            await loadHistory()
        } catch (err) {
            setError(err.message)
        }
    }

    const exportCSV = () => {
        if (history.length === 0) return

        const headers = ['Product ID', 'Predicted Sales', 'Date']

        const rows = history.map(item => [
            item.product,
            item.sales,
            item.date
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;'
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url
        link.download = 'prediction_history.csv'
        link.click()

        URL.revokeObjectURL(url)
    }

    const exportPDF = () => {
        if (history.length === 0) return

        const doc = new jsPDF()

        doc.setFillColor(30, 64, 175)
        doc.rect(0, 0, 210, 40, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(20)
        doc.text('Sales Prediction History', 14, 18)

        doc.setFontSize(10)
        doc.text('Product & Sales Forecasting System', 14, 28)

        doc.setTextColor(40, 40, 40)
        doc.setFontSize(11)

        doc.text(`Total Predictions: ${history.length}`, 14, 52)
        doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 60)

        autoTable(doc, {
            startY: 70,
            head: [['Product ID', 'Predicted Sales', 'Date']],
            body: history.map(item => [
                item.product,
                Number(item.sales).toFixed(2),
                item.date.split(',')[0]
            ]),
            theme: 'striped',
            headStyles: {
                fillColor: [37, 99, 235]
            },
            styles: {
                fontSize: 10,
                cellPadding: 4
            }
        })

        const pageCount = doc.internal.getNumberOfPages()

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(9)
            doc.setTextColor(100, 100, 100)

            doc.text('Product & Sales Forecasting System', 14, 287)
            doc.text(`Page ${i} of ${pageCount}`, 180, 287)
        }

        doc.save('prediction_history.pdf')
    }

    return (
        <div className="min-h-screen">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
                        📜
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Prediction History
                        </h2>
                        <p className="text-sm text-slate-500">
                            View and manage all your previous predictions
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                    {error}
                </div>
            )}

            <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        All Predictions ({history.length})
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Import CSV
                            <input
                                type="file"
                                accept=".csv"
                                onChange={importCSV}
                                className="hidden"
                            />
                        </label>

                        <button
                            onClick={exportCSV}
                            disabled={history.length === 0}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            Export CSV
                        </button>

                        <button
                            onClick={exportPDF}
                            disabled={history.length === 0}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            Download PDF
                        </button>

                        <button
                            onClick={handleClearHistory}
                            disabled={history.length === 0}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                        >
                            Clear History
                        </button>
                    </div>
                </div>

                {historyLoading ? (
                    <p className="py-6 text-center text-gray-500">
                        Loading prediction history...
                    </p>
                ) : history.length === 0 ? (
                    <p className="py-6 text-center text-gray-500">
                        No prediction history available.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-sm text-gray-500">
                                    <th className="p-3">Product ID</th>
                                    <th className="p-3">Predicted Sales</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id} className="border-b text-sm">
                                        <td className="p-3 font-medium">
                                            {item.product}
                                        </td>
                                        <td className="p-3">
                                            {Number(item.sales).toFixed(2)} Units
                                        </td>
                                        <td>
                                            {new Date(item.date).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="rounded-lg bg-red-100 px-3 py-1 text-red-600 hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PredictionHistory

