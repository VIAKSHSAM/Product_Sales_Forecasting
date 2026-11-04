from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from jose import jwt, JWTError
from pathlib import Path
import pandas as pd
import joblib

from database import get_db, engine, Base
from models import User, Prediction
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)


app = FastAPI()

security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR.parent / "models"

model = joblib.load(MODEL_DIR / "sales_prediction_model.pkl")
preprocessor = joblib.load(MODEL_DIR / "preprocessor.pkl")


class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PredictionInput(BaseModel):
    Store_ID: str
    Product_ID: str
    Category: str
    Region: str
    Weather_Condition: str
    Seasonality: str
    Inventory_Level: int
    Units_Ordered: int
    Price: float
    Discount: float
    Holiday_Promotion: int
    Competitor_Pricing: float
    Year: int
    Month: int
    Day: int
    DayOfWeek: int

class CSVImportInput(BaseModel):
    product: str
    sales: float
    date: str

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


@app.get("/")
def home():
    return {
        "message": "Product & Sales Forecasting API is running"
    }


@app.get("/model-status")
def model_status():
    return {
        "message": "Machine Learning Model Loaded Successfully"
    }


@app.post("/signup")
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        (User.username == data.username) |
        (User.email == data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists"
        )

    new_user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "username": new_user.username
    }


@app.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username
    }


@app.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }


@app.post("/predict")
def predict_sales(
    data: PredictionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    input_data = pd.DataFrame([{
        "Store ID": data.Store_ID,
        "Product ID": data.Product_ID,
        "Category": data.Category,
        "Region": data.Region,
        "Weather Condition": data.Weather_Condition,
        "Seasonality": data.Seasonality,
        "Inventory Level": data.Inventory_Level,
        "Units Ordered": data.Units_Ordered,
        "Price": data.Price,
        "Discount": data.Discount,
        "Holiday/Promotion": data.Holiday_Promotion,
        "Competitor Pricing": data.Competitor_Pricing,
        "Year": data.Year,
        "Month": data.Month,
        "Day": data.Day,
        "DayOfWeek": data.DayOfWeek
    }])

    transformed_data = preprocessor.transform(input_data)
    prediction = model.predict(transformed_data)

    predicted_sales = round(float(prediction[0]), 2)

    new_prediction = Prediction(
        user_id=current_user.id,
        product_id=data.Product_ID,
        store_id=data.Store_ID,
        input_data=input_data.to_dict(orient="records")[0],
        predicted_sales=predicted_sales
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    return {
        "predicted_sales": predicted_sales,
        "message": "Prediction saved successfully"
    }


@app.get("/analytics")
def get_analytics(
    current_user: User = Depends(get_current_user)
):
    dataset_path = BASE_DIR.parent / "dataset" / "retail_store_inventory.csv"

    df = pd.read_csv(dataset_path)

    df["Date"] = pd.to_datetime(df["Date"])

    last_date = df["Date"].max()

    monthly_df = df[
        df["Date"].dt.to_period("M") < last_date.to_period("M")
    ]

    monthly = monthly_df.groupby(
        monthly_df["Date"].dt.to_period("M")
    )["Units Sold"].sum()

    category = df.groupby("Category")["Units Sold"].sum()

    region = df.groupby("Region")["Units Sold"].sum()

    products = df.groupby(
        "Product ID"
    )["Units Sold"].sum().nlargest(10)

    return {
        "total_products": int(df["Product ID"].nunique()),
        "total_sales": int(df["Units Sold"].sum()),
        "total_revenue": round(
            float((df["Units Sold"] * df["Price"]).sum()), 2
        ),
        "monthly_sales": [
            {
                "month": str(index),
                "sales": int(value)
            }
            for index, value in monthly.items()
        ],
        "category_sales": [
            {
                "category": str(index),
                "sales": int(value)
            }
            for index, value in category.items()
        ],
        "region_sales": [
            {
                "region": str(index),
                "sales": int(value)
            }
            for index, value in region.items()
        ],
        "top_products": [
            {
                "product": str(index),
                "sales": int(value)
            }
            for index, value in products.items()
        ]
    }
@app.get("/prediction-history")
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    predictions = db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).order_by(
        Prediction.created_at.desc()
    ).all()

    return [
        {
            "id": prediction.id,
            "product": prediction.product_id,
            "store": prediction.store_id,
            "sales": prediction.predicted_sales,
            "date": prediction.created_at.isoformat(),
            "input_data": prediction.input_data
        }
        for prediction in predictions
    ]

@app.post("/import-history")
def import_history(
    data: CSVImportInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_prediction = Prediction(
        user_id=current_user.id,
        product_id=data.product,
        store_id="CSV Import",
        input_data=data.dict(),
        predicted_sales=data.sales
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    return {
        "message": "CSV record imported successfully",
        "id": new_prediction.id
    }

@app.delete("/prediction-history/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prediction = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id
    ).first()

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    db.delete(prediction)
    db.commit()

    return {"message": "Prediction deleted successfully"}

@app.delete("/prediction-history")
def clear_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(Prediction).filter(
        Prediction.user_id == current_user.id
    ).delete(synchronize_session=False)

    db.commit()

    return {"message": "Prediction history cleared successfully"}