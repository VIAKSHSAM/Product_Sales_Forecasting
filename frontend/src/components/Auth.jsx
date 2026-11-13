import { useState } from 'react'

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true)
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const endpoint = isLogin ? 'login' : 'signup'

        const payload = isLogin
            ? {
                email: form.email,
                password: form.password
            }
            : form

        try {
            const response = await fetch(
                `/api/${endpoint}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || 'Something went wrong')
            }

            if (isLogin) {
                localStorage.setItem('access_token', data.access_token)
                localStorage.setItem('username', data.username)
                onLogin(data.username)
            } else {
                setIsLogin(true)
                setForm({
                    username: '',
                    email: form.email,
                    password: ''
                })
                alert('Registration successful! Please login.')
            }

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center text-slate-800">
                    <span className="text-green-600">Sales</span>Predict
                </h1>

                <p className="text-center text-slate-500 mt-2">
                    Product & Sales Forecasting System
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-6 text-center">
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {!isLogin && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />

                    {error && (
                        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {loading
                            ? 'Please wait...'
                            : isLogin
                                ? 'Login'
                                : 'Sign Up'}
                    </button>

                </form>

                <p className="text-center text-slate-600 mt-6">
                    {isLogin
                        ? "Don't have an account?"
                        : 'Already have an account?'}

                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError('')
                        }}
                        className="text-green-600 font-semibold ml-2 hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>

            </div>

        </div>
    )
}

export default Auth