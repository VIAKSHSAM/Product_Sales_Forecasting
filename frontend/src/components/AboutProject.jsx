import React from 'react'

function AboutProject() {
    return (
        <div className="space-y-8">

            <div>
                <h2 className="text-3xl font-bold text-slate-800">
                    About Project
                </h2>
                <p className="text-slate-500 mt-2">
                    Learn more about our AI-powered retail sales forecasting system.
                </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-3">
                    SalesPredict
                </h1>
                <p className="text-lg">
                    Smart Retail Sales Forecasting System
                </p>
                <p className="mt-4 text-blue-100">
                    An intelligent machine learning application designed to
                    predict product sales using historical retail data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        Project Overview
                    </h3>
                    <p className="text-slate-600 leading-7">
                        SalesPredict is a machine learning-based retail sales
                        forecasting system. It analyzes product, store,
                        inventory, pricing, weather and seasonal information
                        to estimate expected product sales.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        Problem Statement
                    </h3>
                    <p className="text-slate-600 leading-7">
                        Retail businesses often face difficulties estimating
                        future product demand. Incorrect sales estimates can
                        lead to overstocking or stock shortages.
                        SalesPredict helps estimate product demand using
                        historical retail data and machine learning.
                    </p>
                </div>


            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        Project Objectives
                    </h3>

                    <ul className="space-y-3 text-slate-600">
                        <li>✓ Predict expected retail product sales.</li>
                        <li>✓ Analyze historical sales data.</li>
                        <li>✓ Understand the impact of pricing and discounts.</li>
                        <li>✓ Support better inventory management.</li>
                        <li>✓ Provide interactive sales analytics.</li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        Technologies Used
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {[
                            'Python',
                            'Pandas',
                            'NumPy',
                            'Scikit-learn',
                            'Random Forest',
                            'FastAPI',
                            'React.js',
                            'Tailwind CSS',
                            'SQLite',
                            'SQLAlchemy',
                            'Recharts'
                        ].map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        Machine Learning Model
                    </h3>

                    <p className="text-slate-600 leading-7 mb-4">
                        SalesPredict uses a Random Forest Regressor algorithm to predict
                        product sales based on historical retail data and product-related
                        information.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Algorithm</p>
                            <h4 className="font-semibold text-slate-800 mt-1">
                                Random Forest
                            </h4>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Training Split</p>
                            <h4 className="font-semibold text-slate-800 mt-1">
                                80% Training
                            </h4>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Testing Split</p>
                            <h4 className="font-semibold text-slate-800 mt-1">
                                20% Testing
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        Dataset Information
                    </h3>

                    <p className="text-slate-600 leading-7 mb-5">
                        The project uses a retail store inventory dataset containing
                        historical sales and product information. This data is used
                        to train and evaluate the machine learning model.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Total Records</p>
                            <h4 className="text-2xl font-bold text-slate-800 mt-1">73,100</h4>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Original Features</p>
                            <h4 className="text-2xl font-bold text-slate-800 mt-1">15</h4>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Target Variable</p>
                            <h4 className="text-lg font-bold text-slate-800 mt-2">Units Sold</h4>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                            <p className="text-sm text-slate-500">Date Range</p>
                            <h4 className="text-lg font-bold text-slate-800 mt-2">2022–2024</h4>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        Model Performance
                    </h3>

                    <p className="text-slate-600 leading-7 mb-5">
                        The Random Forest model was evaluated using a separate test
                        dataset. The following metrics describe its prediction performance.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-blue-50 p-5 rounded-xl">
                            <p className="text-sm text-slate-500">Mean Absolute Error</p>
                            <h4 className="text-3xl font-bold text-blue-700 mt-2">
                                68.80
                            </h4>
                            <p className="text-xs text-slate-500 mt-2">MAE</p>
                        </div>

                        <div className="bg-green-50 p-5 rounded-xl">
                            <p className="text-sm text-slate-500">Root Mean Squared Error</p>
                            <h4 className="text-3xl font-bold text-green-700 mt-2">
                                87.91
                            </h4>
                            <p className="text-xs text-slate-500 mt-2">RMSE</p>
                        </div>

                        <div className="bg-purple-50 p-5 rounded-xl">
                            <p className="text-sm text-slate-500">R² Score</p>
                            <h4 className="text-3xl font-bold text-purple-700 mt-2">
                                34.04%
                            </h4>
                            <p className="text-xs text-slate-500 mt-2">Coefficient of Determination</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-5">
                        Project Workflow
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="border border-slate-200 rounded-xl p-5">
                            <h4 className="font-semibold text-slate-800 mb-2">
                                1. Data Collection
                            </h4>
                            <p className="text-sm text-slate-600 leading-6">
                                Retail store inventory data is collected from the CSV dataset,
                                containing product, store, pricing, inventory and sales information.
                            </p>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-5">
                            <h4 className="font-semibold text-slate-800 mb-2">
                                2. Data Preprocessing
                            </h4>
                            <p className="text-sm text-slate-600 leading-6">
                                The dataset is prepared for machine learning by selecting useful
                                features, encoding categorical values and preparing training data.
                            </p>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-5">
                            <h4 className="font-semibold text-slate-800 mb-2">
                                3. Model Training
                            </h4>
                            <p className="text-sm text-slate-600 leading-6">
                                A Random Forest Regressor is trained using historical retail
                                data to learn sales patterns.
                            </p>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-5">
                            <h4 className="font-semibold text-slate-800 mb-2">
                                4. Sales Prediction
                            </h4>
                            <p className="text-sm text-slate-600 leading-6">
                                Users enter product and store details. The trained model
                                predicts expected sales and saves the result in prediction history.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-5">
                        Key Features
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="p-5 border border-slate-200 rounded-xl">
                            <h4 className="font-semibold text-slate-800 mb-2">
                                User Authentication
                            </h4>
                            <p className="text-sm text-slate-600 leading-6">
                                Secure user registration and login with password encryption
                                and token-based authentication.
                            </p>
                        </div>

                        <div className="p-5 border border-slate-200 rounded-xl">
                            <h4 className="font-semibold text-slate-800 mb-2">
                                Sales Prediction
                            </h4>
                            <p className="text-sm text-slate-600 leading-6">
                                Predict expected product sales using the trained
                                Random Forest machine learning model.
                            </p>
                        </div>

                        <div className="p-5 border border-slate-200 rounded-xl">
                            <h4 className="font-semibold text-slate-800 mb-2">
                                Prediction History
                            </h4>
                            <p className="text-sm text-slate-600 leading-6">
                                View, import, export and manage previously generated
                                sales predictions.
                            </p>
                        </div>

                        <div className="p-5 border border-slate-200 rounded-xl">
                            <h4 className="font-semibold text-slate-800 mb-2">
                                Data Analytics
                            </h4>
                            <p className="text-sm text-slate-600 leading-6">
                                Visualize sales trends and analyze sales across
                                different products, categories and regions.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-5">
                        Future Enhancements
                    </h3>

                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-slate-800">
                                Advanced Machine Learning Models
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                                Explore advanced algorithms to improve sales prediction performance.
                            </p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-slate-800">
                                Real-Time Data Integration
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                                Integrate live retail data to generate more updated sales predictions.
                            </p>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-semibold text-slate-800">
                                Improved Forecasting
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                                Include seasonal trends and additional business factors for better forecasting.
                            </p>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                            <h4 className="font-semibold text-slate-800">
                                Cloud Deployment
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                                Deploy the application online so users can access it from anywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AboutProject