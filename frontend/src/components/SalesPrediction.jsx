import { useState } from 'react'

function SalesPrediction() {
    const [form, setForm] = useState({
        Store_ID: 'S001',
        Product_ID: 'P0001',
        Category: 'Groceries',
        Region: 'North',
        Weather_Condition: 'Rainy',
        Seasonality: 'Autumn',
        Inventory_Level: 231,
        Units_Ordered: 55,
        Price: 33.5,
        Discount: 20,
        Holiday_Promotion: 0,
        Competitor_Pricing: 29.69,
        Year: 2022,
        Month: 1,
        Day: 1,
        DayOfWeek: 5
    })

    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setPrediction(null)

        const inputData = {
            ...form,
            Inventory_Level: Number(form.Inventory_Level),
            Units_Ordered: Number(form.Units_Ordered),
            Price: Number(form.Price),
            Discount: Number(form.Discount),
            Holiday_Promotion: Number(form.Holiday_Promotion),
            Competitor_Pricing: Number(form.Competitor_Pricing),
            Year: Number(form.Year),
            Month: Number(form.Month),
            Day: Number(form.Day),
            DayOfWeek: Number(form.DayOfWeek)
        }

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(inputData)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.detail?.[0]?.msg || 'Prediction failed')
            }

            setPrediction(result.predicted_sales)

        } catch (err) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { name: 'Product_ID', label: 'Product ID', type: 'text' },
        { name: 'Store_ID', label: 'Store ID', type: 'text' },
        { name: 'Category', label: 'Category', options: ['Clothing', 'Electronics', 'Furniture', 'Groceries', 'Toys'] },
        { name: 'Region', label: 'Region', options: ['East', 'North', 'South', 'West'] },
        { name: 'Weather_Condition', label: 'Weather Condition', options: ['Sunny', 'Rainy', 'Cloudy', 'Snowy'] },
        { name: 'Seasonality', label: 'Seasonality', options: ['Spring', 'Summer', 'Autumn', 'Winter'] },
        { name: 'Inventory_Level', label: 'Inventory Level', type: 'number' },
        { name: 'Units_Ordered', label: 'Units Ordered', type: 'number' },
        { name: 'Price', label: 'Price (₹)', type: 'number', step: 'any' },
        { name: 'Discount', label: 'Discount (%)', type: 'number', step: 'any' },
        { name: 'Holiday_Promotion', label: 'Holiday Promotion', options: ['0', '1'] },
        { name: 'Competitor_Pricing', label: 'Competitor Pricing (₹)', type: 'number', step: 'any' },
        { name: 'Year', label: 'Year', type: 'number' },
        { name: 'Month', label: 'Month (1-12)', type: 'number', min: 1, max: 12 },
        { name: 'Day', label: 'Day (1-31)', type: 'number', min: 1, max: 31 },
        { name: 'DayOfWeek', label: 'Day Of Week (0-6)', type: 'number', min: 0, max: 6 }
    ]

    const inputClass = 'w-full border border-slate-200 bg-slate-50 px-4 py-3 rounded-xl outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white'

    return (
        <div className="min-h-screen">

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <img
                            src="https://api.iconify.design/carbon/machine-learning-model.svg?color=%231d4ed8"
                            alt="Prediction"
                            className="w-7 h-7 object-contain"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Sales Prediction
                        </h2>
                        <p className="text-sm text-slate-500">
                            AI-powered retail sales forecasting
                        </p>
                    </div>
                </div>

                <p className="text-slate-500">
                    Enter product and store details to predict expected sales using our Machine Learning Model.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200 max-w-5xl"
            >

                <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                        <img
                            src="https://api.iconify.design/carbon/product.svg?color=%231d4ed8"
                            alt="Product Details"
                            className="w-6 h-6 object-contain"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            Product Details
                        </h3>
                        <p className="text-sm text-slate-500">
                            Fill in all the required information
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">

                    {fields.map((field) => (
                        <div key={field.name}>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {field.label}
                            </label>

                            {field.options ? (
                                <select
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    className={inputClass}
                                    required
                                >
                                    {field.options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step}
                                    required
                                    className={inputClass}
                                />
                            )}

                        </div>
                    ))}

                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition duration-200 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Predicting Sales...
                            </>
                        ) : (
                            <>
                                <img
                                    src="https://api.iconify.design/carbon/chart-line.svg?color=%23ffffff"
                                    alt=""
                                    className="w-5 h-5 object-contain"
                                />
                                Predict Sales
                            </>
                        )}
                    </button>

                </div>

                {prediction !== null && (
                    <div className="mt-8 p-6 md:p-8 bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl">

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                                <img
                                    src="https://api.iconify.design/carbon/chart-evaluation.svg?color=%23047857"
                                    alt="Sales Growth"
                                    className="w-7 h-7 object-contain"
                                />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-green-800">
                                    Prediction Successful!
                                </h3>

                                <p className="text-sm text-green-700">
                                    Your estimated product sales
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-medium text-green-700">
                                Predicted Sales
                            </p>

                            <h2 className="text-4xl md:text-5xl font-bold text-green-700 mt-2">
                                {Number(prediction).toFixed(2)}
                                <span className="text-xl ml-2">Units</span>
                            </h2>
                        </div>

                    </div>
                )}

                {error && (
                    <div className="mt-6 p-5 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                        <p className="font-semibold">Prediction Failed</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

            </form>

            <div className="mt-6 max-w-5xl bg-blue-50 border border-blue-100 p-5 rounded-xl">
                <p className="text-sm text-blue-800">
                    <img
                        src="https://api.iconify.design/carbon/information.svg?color=%231d4ed8"
                        alt="Tip"
                        className="inline-block w-5 h-5 mr-2 align-middle"
                    />
                    <strong>Tip:</strong> Enter accurate product, inventory, pricing and seasonal information to get a meaningful prediction.
                </p>
            </div>

        </div>
    )
}

export default SalesPrediction