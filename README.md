# SalesPredict – Product & Sales Forecasting System

An AI-powered retail sales forecasting application that predicts product sales using historical retail data and a Machine Learning model.

## Project Overview

SalesPredict is a full-stack Machine Learning application designed to help retail businesses estimate product sales. It uses historical sales, inventory, pricing, weather, seasonal, and store-related information to predict expected product demand.

The application provides an interactive dashboard, sales prediction, user authentication, prediction history, and data analytics.

## Features

* **User Authentication:** Secure user registration and login.
* **Sales Prediction:** Predict product sales using a trained Random Forest Regressor.
* **Interactive Dashboard:** View sales statistics and visualizations.
* **Prediction History:** View and manage previous predictions.
* **CSV Import/Export:** Import and export prediction records.
* **PDF Export:** Download prediction history as a PDF.
* **Data Analytics:** Analyze sales trends across categories, regions, and products.
* **User-specific History:** Each user can manage their own prediction records.

## Technology Stack

### Machine Learning & Data Processing

* Python
* Pandas
* NumPy
* Scikit-learn
* Random Forest Regressor
* Joblib

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* JWT Authentication

### Frontend

* React.js
* Vite
* Tailwind CSS
* Recharts

## Dataset Information

The project uses a Retail Store Inventory dataset.

| Description       |    Details |
| ----------------- | ---------: |
| Total Records     |     73,100 |
| Original Features |         15 |
| Target Variable   | Units Sold |
| Date Range        |  2022–2024 |

## Machine Learning Model

The project uses a Random Forest Regressor trained on historical retail sales data.

### Model Training

* Training Data: 80%
* Testing Data: 20%
* Hyperparameter Tuning: RandomizedSearchCV

### Model Performance

| Metric   | Result |
| -------- | -----: |
| MAE      |  68.80 |
| RMSE     |  87.91 |
| R² Score | 34.04% |

These metrics represent the model's performance on the test dataset.

## Project Structure

```text
Product_Sales_Forecasting/
│
├── dataset/
│   └── retail_store_inventory.csv
│
├── notebooks/
│   └── sales_analysis.ipynb
│
├── models/
│   ├── sales_prediction_model.pkl
│   └── preprocessor.pkl
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── auth.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .env
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/VIAKSHSAM/Product_Sales_Forecasting.git
cd Product_Sales_Forecasting
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Go back to the project root:

```bash
cd ..
```

Create a `.env` file in the project root and add your own secret key:

```env
SECRET_KEY=your_generated_secret_key
```

Start the FastAPI server:

```bash
cd backend
uvicorn main:app --reload
```

Backend URL:

/api

API Documentation:

/api/docs

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

## Project Workflow

1. Collect historical retail sales data.
2. Preprocess and prepare the dataset.
3. Train and evaluate the Random Forest model.
4. Save the trained model and preprocessor.
5. Start the FastAPI backend.
6. Run the React frontend.
7. Enter product and store information.
8. Generate sales predictions and view results.

## Future Enhancements

* Explore advanced Machine Learning algorithms.
* Integrate real-time retail data.
* Improve forecasting performance.
* Deploy the application to a cloud platform.

## Author

**Vikash Kumar**

MCA – Data Science
National Institute of Technology, Patna

---

**GitHub Repository:**
https://github.com/VIAKSHSAM/Product_Sales_Forecasting
